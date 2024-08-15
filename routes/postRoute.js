import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePostById,
  deletePostById,
} from '../controllers/postController.js';
import { authentication } from '../middleware/auth.js';

const router = express.Router();

// get all posts and create new ones
router.route("/").get(getPosts);
router.route("/:id").get(getPostById);

//protected
router.route("/").post(authentication, createPost);
router.route("/:id/my-posts").get(authentication, getPosts);
router.route("/:id").patch(authentication, updatePostById);
router.route("/:id").delete(authentication, deletePostById);
export default router;
