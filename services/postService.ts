import { Op } from "sequelize";
import AppError from "../utils/errors/appError";
import Post from "../db/models/post";
import User from "../db/models/user";
import Category from "../db/models/category";
import { ERROR_MESSAGES, STATUS_CODE } from "../utils/constants/constants";
import paginate from "../utils/pagination";
import {
  uploadImageToCloudinary,
  generateThumbnailUrl,
  deleteImageFromCloudinary,
} from "../utils/cloudinary";
import {
  PaginatedResponse,
  PaginationOptions,
  PostRequest,
  PostResponse,
} from "./interfaces";
import { PostAttributes } from "../db/models/modelInterfaces";

// Create a new post
const createPostServices = async (
  userId: number,
  postData: PostAttributes,
  file?: Express.Multer.File
): Promise<PostResponse> => {
  try {
    let imageUrl: string | null = null;
    let thumbnailUrl: string | null = null;

    if (file && file.path) {
      // Upload the image to Cloudinary
      imageUrl = await uploadImageToCloudinary(file.path);
      // Extract the public ID from the image URL
      const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
      // Generate the thumbnail URL
      thumbnailUrl = generateThumbnailUrl(publicId);
    }

    // Create the new post with or without the image and thumbnail
    const newPost = await Post.create({
      userId,
      categoryId: postData.categoryId,
      title: postData.title,
      content: postData.content,
      readTime: postData.readTime,
      image: imageUrl || null,
      thumbnail: thumbnailUrl || null,
    });

    return newPost;
  } catch (error) {
    throw new AppError(
      error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

// Get all posts with optional search and user filter
const getAllPostServices = async ({
  searchBy,
  page = 1,
  limit = 10,
  userId,
}: PaginationOptions & { searchBy?: string; userId?: number }): Promise<
  PaginatedResponse<PostResponse>
> => {
  try {
    console.log("Getting all posts", searchBy, userId, page, limit);

    // Define the base query options
    const queryOptions: any = {
      order: [["createdAt", "DESC"]], // Index on `createdAt` can optimize ordering
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "firstName", "lastName", "thumbnail"],
        },
        {
          model: Category,
          as: "Category",
          attributes: ["id", "tag"],
        },
      ],
      where: {},
    };

    // Apply filters if provided
    if (userId) {
      queryOptions.where.userId = userId; // Leverages index on `userId`
    }

    if (searchBy) {
      queryOptions.where[Op.or] = [
        { title: { [Op.iLike]: `%${searchBy}%` } }, // Leverages index on `title`
        { "$Category.tag$": { [Op.iLike]: `%${searchBy}%` } },
      ];
    }

    // Use pagination utility function
    const paginatedPosts = await paginate(page, limit, queryOptions, Post);
    return paginatedPosts;
  } catch (error) {
    throw new AppError(
      error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

// Get details of a specific post by postId
const getPostServices = async (postId: number): Promise<PostResponse> => {
  try {
    console.log("Getting post", postId);
    const post = await Post.findByPk(postId, {
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "firstName", "lastName", "thumbnail"],
        },
        {
          model: Category,
          as: "Category",
          attributes: ["id", "tag"],
        },
      ],
    });

    if (!post) {
      throw new AppError(ERROR_MESSAGES.POST_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    return post;
  } catch (error) {
    throw new AppError(
      error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

// Get all posts created by a specific user
const myPostsServices = async (
  userId: number,
  { page = 1, limit = 10 }: PaginationOptions
): Promise<PaginatedResponse<PostResponse>> => {
  try {
    console.log("Getting posts by user", userId);

    // Define the base query options
    const queryOptions = {
      where: { userId }, // Leverages index on `userId`
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: Category,
          as: "Category",
          attributes: ["id", "tag"],
        },
      ],
      order: [["createdAt", "DESC"]], // Index on `createdAt` can optimize ordering
    };

    // Use pagination utility function
    const paginatedPosts = await paginate(page, limit, queryOptions, Post);
    return paginatedPosts;
  } catch (error) {
    throw new AppError(
      error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

// Update a post
const updatePostServices = async (
  postId: number,
  userId: number,
  postData: PostRequest,
  file?: Express.Multer.File
): Promise<PostResponse> => {
  try {
    // Fetch the existing post
    const existingPost = await Post.findByPk(postId);
    if (!existingPost) {
      throw new AppError(ERROR_MESSAGES.POST_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    if (existingPost.userId !== userId) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, STATUS_CODE.UNAUTHORIZED);
    }

    let imageUrl = existingPost.image;
    let thumbnailUrl = existingPost.thumbnail;

    if (file && file.path) {
      // Delete the old image from Cloudinary
      if (existingPost.image) {
        const publicId = existingPost.image
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];
        await deleteImageFromCloudinary(publicId);
      }

      // Upload the new image to Cloudinary
      imageUrl = await uploadImageToCloudinary(file.path);
      // Extract the public ID from the image URL
      const newPublicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
      // Generate the new thumbnail URL
      thumbnailUrl = generateThumbnailUrl(newPublicId);
    }

    // Update the post with the new data
    await existingPost.update({
      categoryId: postData.categoryId || existingPost.categoryId,
      title: postData.title || existingPost.title,
      content: postData.content || existingPost.content,
      readTime: postData.readTime || existingPost.readTime,
      image: imageUrl,
      thumbnail: thumbnailUrl,
    });

    return existingPost;
  } catch (error) {
    throw new AppError(
      error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

// Delete a post
const deletePostServices = async ({
  postId,
  userId,
}: {
  postId: number;
  userId: number;
}): Promise<PostResponse> => {
  try {
    const post = await Post.findByPk(postId);

    if (!post) {
      throw new AppError(ERROR_MESSAGES.POST_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    if (post.userId !== userId) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, STATUS_CODE.UNAUTHORIZED);
    }

    if (post.image) {
      const publicId = post.image.split("/").slice(-2).join("/").split(".")[0];
      await deleteImageFromCloudinary(publicId);
    }

    await Post.destroy({ where: { id: postId, userId } });
    return post;
  } catch (error) {
    throw new AppError(
      error.message || ERROR_MESSAGES.POST_DELETION_FAILED,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

export {
  createPostServices,
  getAllPostServices,
  getPostServices,
  myPostsServices,
  updatePostServices,
  deletePostServices,
};
