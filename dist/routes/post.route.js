"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_controller_1 = require("../controllers/post.controller");
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("../middleware/multer"));
const router = express_1.default.Router();
// Public routes
router.route("/").get(post_controller_1.getPosts);
router.route("/:id").get(post_controller_1.getPostById);
// Protected routes
router.route("/").post(auth_1.authentication, multer_1.default.single("image"), post_controller_1.createPost);
router.route("/:id/my-posts").get(auth_1.authentication, post_controller_1.getPosts);
router
    .route("/:id")
    .patch(auth_1.authentication, multer_1.default.single("image"), post_controller_1.updatePostById);
router.route("/:id").delete(auth_1.authentication, post_controller_1.deletePostById);
exports.default = router;
