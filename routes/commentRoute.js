import express from 'express';
import {
  createComment,
  postComments,
  updateCommentById,
  deleteCommentById,
  getCommentReplies,
  getCommentCount,
} from '../controllers/commentController.js';
import { authentication } from '../middleware/auth.js';

const router = express.Router()
// Get total count of comments on a post
router.route("/:id/count").get(getCommentCount);
router.route("/:id").get(postComments);
router.route("/:id/replies").get( getCommentReplies);

// protected routes
router.route("/").post(authentication, createComment);
router.route("/:id").patch(authentication, updateCommentById);
router.route("/:id").delete(authentication, deleteCommentById);



export default router;
