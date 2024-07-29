const Post = require('../db/models/post'); 

const createPost = async (userId, title, body) => {
  try {
    const newPost = await Post.create({ userId, title, body});
    return newPost;
  } catch (error) {
    throw error;
  }
};

module.exports = { createPost };

