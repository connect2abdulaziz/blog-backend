const router = require("express").Router();
const {
  createComment,
  postComments,
  updateCommentById,
  deleteCommentById,
  getCommentReplies,
} = require("../controllers/commentController");
const { authentication } = require("../middleware/auth");

router.route("/").post(authentication, createComment);
router.route("/:id").get(authentication, postComments);
router.route("/:id/replies").get(authentication, getCommentReplies);
router.route("/:id").patch(authentication, updateCommentById);
router.route("/:id").delete(authentication, deleteCommentById);
module.exports = router;
