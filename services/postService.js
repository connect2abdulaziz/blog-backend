const Post = require("../db/models/post");
const User = require("../db/models/user");
const Category = require("../db/models/category");
const Comment = require("../db/models/comment");
const AppError = require("../utils/errors/appError");
const { Op } = require("sequelize");
const { ERROR_MESSAGES, STATUS_CODE } = require("../utils/constants/constants");

// Create a new post
const createPostServices = async (
  userId,
  { categoryId, title, content, readTime, image, thumbnail }
) => {
  try {
    const newPost = await Post.create({
      userId,
      categoryId,
      title,
      content,
      readTime,
      image,
      thumbnail,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return newPost;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      ERROR_MESSAGES.CONTENT_REQUIRED,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

const getAllPostServices = async (searchBy, userId) => {
  try {
    // Define the base query options
    const queryOptions = {
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "thumbnail"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "tag"],
        },
      ],
    };

    // Initialize where clause
    queryOptions.where = {};

    // If userId is provided, add the userId condition to the query
    if (userId) {
      queryOptions.where.userId = userId;
    }

    // If a search term is provided, add the search condition to the query
    if (searchBy) {
      queryOptions.where[Op.or] = [
        {
          title: {
            [Op.iLike]: `%${searchBy}%`,
          },
        },
        {
          "$category.tag$": {
            [Op.iLike]: `%${searchBy}%`,
          },
        },
      ];
    }

    // Execute the query with the constructed options and include the count
    const { count, rows: posts } = await Post.findAndCountAll(queryOptions);
    return { count, posts };
  } catch (error) {
    if( error instanceof AppError ) {
      throw error;
    }
    throw new AppError(
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};




// Get details of a specific post by postId
const getPostServices = async (postId) => {
  try {
    const post = await Post.findByPk(postId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "tag"],
        },
        {
          model: Comment,
          as: "comments",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "firstName", "lastName", "thumbnail"],
            },
          ],
          attributes: ["id", "content", "createdAt"],
        },
      ],
    });

    if (!post) {
      console.log("No post found");
      throw new AppError(ERROR_MESSAGES.POST_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    return post;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};



// Get all posts created by a specific user
const myPostsServices = async (userId) => {
  try {
    const posts = await Post.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "tag"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    if (!posts) {
      throw new AppError(ERROR_MESSAGES.POST_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    return posts;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

// Update an existing post
const updatePostServices = async (
  postId,
  userId,
  { categoryId, title, content, readTime, image, thumbnail }
) => {
  try {
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
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      ERROR_MESSAGES.POST_UPDATE_FAILED,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
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
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      ERROR_MESSAGES.POST_DELETION_FAILED,
      STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = {
  createPostServices,
  getAllPostServices,
  getPostServices,
  myPostsServices,
  updatePostServices,
  deletePostServices,
};
