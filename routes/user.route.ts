import {
  signup,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
  updateImage,
  refreshToken,
  logout,
} from "../controllers/user.controller";
import { authentication } from "../middleware/auth";
import upload from "../middleware/multer";
import express, { Router } from "express";

const router: Router = express.Router();

// User auth related routes
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/verify-email/:token").post(verifyEmail);
router.route("/refresh-token").post(refreshToken);

// Protected routes
router.route("/current").get(authentication, getUserById);
router.route("/update").patch(authentication, updateUser);
router
  .route("/update-image")
  .patch(authentication, upload.single("image"), updateImage);
router.route("/delete").delete(authentication, deleteUser);
router.route("/change-password").patch(authentication, changePassword);
router.route("/logout").post(authentication, logout);

export default router;
