import express, { Router } from "express";
import {
  createComment,
  postComments,
  updateCommentById,
  deleteCommentById,
  getCommentReplies,
} from "../controllers/comment.controller";
import { authentication } from "../middleware/auth";

const router: Router = express.Router();

// Public routes
router.route("/:id").get(postComments);
router.route("/:id/replies").get(getCommentReplies);

// Protected routes
router.route("/").post(authentication, createComment);
router.route("/:id").patch(authentication, updateCommentById);
router.route("/:id").delete(authentication, deleteCommentById);

export default router;
