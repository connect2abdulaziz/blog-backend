"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("../middleware/multer"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// User auth related routes
router.route("/signup").post(user_controller_1.signup);
router.route("/login").post(user_controller_1.login);
router.route("/forgot-password").post(user_controller_1.forgotPassword);
router.route("/reset-password/:token").post(user_controller_1.resetPassword);
router.route("/verify-email/:token").post(user_controller_1.verifyEmail);
router.route("/refresh-token").post(user_controller_1.refreshToken);
// Protected routes
router.route("/current").get(auth_1.authentication, user_controller_1.getUserById);
router.route("/update").patch(auth_1.authentication, user_controller_1.updateUser);
router
    .route("/update-image")
    .patch(auth_1.authentication, multer_1.default.single("image"), user_controller_1.updateImage);
router.route("/delete").delete(auth_1.authentication, user_controller_1.deleteUser);
router.route("/change-password").patch(auth_1.authentication, user_controller_1.changePassword);
router.route("/logout").post(auth_1.authentication, user_controller_1.logout);
exports.default = router;
