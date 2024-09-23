"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comment_controller_1 = require("../controllers/comment.controller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public routes
router.route("/:id").get(comment_controller_1.postComments);
router.route("/:id/replies").get(comment_controller_1.getCommentReplies);
// Protected routes
router.route("/").post(auth_1.authentication, comment_controller_1.createComment);
router.route("/:id").patch(auth_1.authentication, comment_controller_1.updateCommentById);
router.route("/:id").delete(auth_1.authentication, comment_controller_1.deleteCommentById);
exports.default = router;
