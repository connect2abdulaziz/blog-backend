const Post = require('../db/models/post'); 
const User = require('../db/models/user');
const Category = require('../db/models/category');
const Comment = require('../db/models/comment');
const AppError = require('../utils/appError');
const { Op } = require('sequelize'); 


const createPost = async ({userId, categoryId, title, content, readTime,  image, thumbnail}) => {
  try {
    const newPost = await Post.create({userId, categoryId, title, content, readTime, image, thumbnail, createdAt: new Date(), updatedAt: new Date()});
    return newPost;
  } catch (error) {
    throw error;
  }
};


const getAllPost = async () => {
  try {
    const posts = await Post.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        { 
          model: User,
          as: 'user', 
          attributes: ['id', 'firstName', 'lastName', 'thumbnail'] 
        },
        {
          model: Category,
          as: 'category', 
          attributes: ['id', 'tag']
        }
      ]
    });
    return posts;
  } catch (error) {
    throw error;
  }
};




const getPostDetails = async (postId) => {
  try {
    const post = await Post.findByPk(postId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'tag']
        },
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName', 'thumbnail']
            }
          ],
          attributes: ['id', 'content', 'createdAt']
        }
      ]
    });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    return post;
  } catch (error) {
    throw error;
  }
};



const searchPostsByTitleOrTag = async (searchTerm) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'tag']
        }
      ],
      where: {
        [Op.or]: [
          {
            title: {
              [Op.iLike]: `%${searchTerm}%`
            }
          },
          {
            '$category.tag$': {
              [Op.iLike]: `%${searchTerm}%`
            }
          }
        ]
      },
      order: [['createdAt', 'DESC']]
    });

    return posts;
  } catch (error) {
    throw error;
  }
};


const getAllMyPosts = async (userId) => {
  try {
    const posts = await Post.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'tag']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    return posts;
  } catch (error) {
    throw error;
  }
}

const updatePost = async ({ postId, userId, categoryId, title, content, readTime, image, thumbnail }) => {
  try {
    const [affectedRows] = await Post.update({
      userId,
      categoryId,
      title,
      content,
      readTime,
      image,
      thumbnail,
      updatedAt: new Date() 
    }, {
      where: { id: postId } 
    });

    if (affectedRows === 0) {
      throw new AppError('Post not found or no changes made', 404);
    }
    const updatedPost = await Post.findByPk(postId);
    return updatedPost;
  } catch (error) {
    throw error;
  }
};

const deletePost = async ({ postId}) => {
  try {
    const affectedRows = await Post.destroy({ where: { id: postId } });
    if (affectedRows === 0) {
      throw new AppError('Post not found', 404);
    }
    return postId;
  } catch (error) {
    throw error;
  }
}
module.exports = { createPost, getAllPost, getPostDetails, searchPostsByTitleOrTag, getAllMyPosts, updatePost, deletePost};

