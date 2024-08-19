import { Op } from 'sequelize';
import AppError from '../utils/errors/appError.js';
import Post from '../db/models/post.js';
import User from '../db/models/user.js';
import Category from '../db/models/category.js';
import Comment from '../db/models/comment.js';
import { ERROR_MESSAGES, STATUS_CODE } from '../utils/constants/constants.js';
import paginate from '../utils/pagination.js';

// Create a new post
const createPostServices = async (userId, { categoryId, title, content, readTime, image, thumbnail }) => {
  try {
    console.log('Creating post', userId, categoryId, title, content);
    const newPost = await Post.create({
      userId,
      categoryId,
      title,
      content,
      readTime,
      image,
      thumbnail,
    });
    return newPost;
  } catch (error) {
    throw new AppError(error.message || ERROR_MESSAGES.CONTENT_REQUIRED, STATUS_CODE.INTERNAL_SERVER_ERROR);
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
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'thumbnail'],
        },
        {
          model: Category,
          as: 'category',
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
        { '$category.tag$': { [Op.iLike]: `%${searchBy}%` } },
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
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'tag'],
        },
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'user',
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
