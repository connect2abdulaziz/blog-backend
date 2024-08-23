import {
  signup,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
  updateImage,
  logout,
} from "../controllers/userController.js";
import { authentication } from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import express from "express";

const router = express.Router();

// User auth related routes
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/verify-email/:token").post(verifyEmail);

// Protected routes
router.route("/").get(authentication, getAllUsers);
router.route("/:id").get(authentication, getUserById);
router.route("/update").patch(authentication, updateUser);
router.route("/update-image").patch(authentication, upload.single('image'), updateImage);
router.route("/delete").delete(authentication, deleteUser);
router.route("/change-password").patch(authentication, changePassword);
router.route("/logout").post(authentication, logout);

export default router;
