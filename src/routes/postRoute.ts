import express, { Router } from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePostById,
  deletePostById,
} from "../controllers/postController";
import { authentication } from "../middleware/auth";
import upload from "../middleware/multer";

const router: Router = express.Router();

// Public routes
router.route("/").get(getPosts);
router.route("/:id").get(getPostById);

// Protected routes
router.route("/").post(authentication, upload.single("image"), createPost);
router.route("/:id/my-posts").get(authentication, getPosts);
router
  .route("/:id")
  .patch(authentication, upload.single("image"), updatePostById);
router.route("/:id").delete(authentication, deletePostById);

export default router;
