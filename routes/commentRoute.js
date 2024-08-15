import express from 'express';
import {
  createComment,
  postComments,
  updateCommentById,
  deleteCommentById,
  getCommentReplies,
} from '../controllers/commentController.js';
import { authentication } from '../middleware/auth.js';

const router = express.Router()

router.route("/").post(authentication, createComment);
router.route("/:id").get(postComments);
router.route("/:id/replies").get(authentication, getCommentReplies);
router.route("/:id").patch(authentication, updateCommentById);
router.route("/:id").delete(authentication, deleteCommentById);

export default router;
