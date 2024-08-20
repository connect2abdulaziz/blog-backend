import { Op } from 'sequelize';
import AppError from '../utils/errors/appError.js';
import Post from '../db/models/post.js';
import User from '../db/models/user.js';
import Category from '../db/models/category.js';
import Comment from '../db/models/comment.js';
import { ERROR_MESSAGES, STATUS_CODE } from '../utils/constants/constants.js';
import paginate from '../utils/pagination.js';
import { uploadImageToCloudinary, generateThumbnailUrl } from '../utils/cloudinary.js';

/**
 * Service to create a new post and upload its image to Cloudinary.
 * @param {string} userId - The ID of the user creating the post.
 * @param {object} postData - The data of the post to be created.
 * @param {object} file - The image file to be uploaded.
 * @returns {Promise<Post>} - The newly created post.
 * @throws {AppError} - If an error occurs during creation or upload.
 */
const createPostServices = async (userId, { categoryId, title, content, readTime }, file) => {
  try {

    let imageUrl = null;
    let thumbnailUrl = null;

    if (file && file.path) {
      // Upload the image to Cloudinary
      imageUrl = await uploadImageToCloudinary(file.path);
      // Extract the public ID from the image URL
      const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
      // Generate the thumbnail URL
      thumbnailUrl = generateThumbnailUrl(publicId);
    }
    // Create the new post with or without the image and thumbnail
    const newPost = await Post.create({
      userId,
      categoryId,
      title,
      content,
      readTime,
      image: imageUrl || null,
      thumbnail: thumbnailUrl || null,
    });

    return newPost;
  } catch (error) {
    throw new AppError(error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
};



// Get all posts with optional search and user filter
const getAllPostServices = async ({ searchBy, page = 1, limit = 10, userId }) => {
  try {
    console.log('Getting all posts', searchBy, userId, page, limit);

    // Define the base query options
    const queryOptions = {
      order: [['createdAt', 'DESC']], // Index on `createdAt` can optimize ordering
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'firstName', 'lastName', 'thumbnail'],
        },
        {
          model: Category,
          as: 'Category',
          attributes: ['id', 'tag'],
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
        { '$Category.tag$': { [Op.iLike]: `%${searchBy}%` } },
      ];
    }

    // Use pagination utility function
    const paginatedPosts = await paginate(page, limit, queryOptions, Post);
    return paginatedPosts;
  } catch (error) {
    throw new AppError(error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
};

// Get details of a specific post by postId
const getPostServices = async (postId) => {
  try {
    console.log('Getting post', postId);
    const post = await Post.findByPk(postId, {
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: Category,
          as: 'Category',
          attributes: ['id', 'tag'],
        },
        {
          model: Comment,
          as: 'Comment',
          include: [
            {
              model: User,
              as: 'User',
              attributes: ['id', 'firstName', 'lastName', 'thumbnail'],
            },
          ],
          attributes: ['id', 'content', 'createdAt'],
        },
      ],
    });

    if (!post) {
      throw new AppError(ERROR_MESSAGES.POST_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    return post;
  } catch (error) {
    throw new AppError(error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
};

// Get all posts created by a specific user
const myPostsServices = async (userId, { page = 1, limit = 10 }) => {
  try {
    console.log('Getting posts by user', userId);

    // Define the base query options
    const queryOptions = {
      where: { userId }, // Leverages index on `userId`
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'tag'],
        },
      ],
      order: [['createdAt', 'DESC']], // Index on `createdAt` can optimize ordering
    };

    // Use pagination utility function
    const paginatedPosts = await paginate(page, limit, queryOptions);
    return paginatedPosts;
  } catch (error) {
    throw new AppError(error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
};

// Update an existing post
const updatePostServices = async (postId, userId, { categoryId, title, content, readTime, image, thumbnail }) => {
  try {
    console.log('Updating post', postId, userId, categoryId, title, content);
    const post = await Post.findByPk(postId);

    if (!post) {
      throw new AppError(ERROR_MESSAGES.POST_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    if (post.userId !== userId) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, STATUS_CODE.UNAUTHORIZED);
    }

    await Post.update(
      {
        categoryId,
        title,
        content,
        readTime,
        image,
        thumbnail,
        updatedAt: new Date(),
      },
      {
        where: { id: postId, userId }, 
      }
    );

    const updatedPost = await Post.findByPk(postId);
    return { post, updatedPost };
  } catch (error) {
    throw new AppError(error.message || ERROR_MESSAGES.POST_UPDATE_FAILED, STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
};

// Delete a post
const deletePostServices = async ({ postId, userId }) => {
  try {
    const post = await Post.findByPk(postId);

    if (!post) {
      throw new AppError(ERROR_MESSAGES.POST_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    if (post.userId !== userId) {
      throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, STATUS_CODE.UNAUTHORIZED);
    }

    await Post.destroy({ where: { id: postId, userId } }); 
    return postId;
  } catch (error) {
    throw new AppError(error.message || ERROR_MESSAGES.POST_DELETION_FAILED, STATUS_CODE.INTERNAL_SERVER_ERROR);
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
