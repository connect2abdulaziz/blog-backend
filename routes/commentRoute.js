const router = require("express").Router();
const {
  createComment,
  postComments,
  updateCommentById,
  deleteCommentById,
} = require("../controllers/commentController");
const { authentication } = require("../controllers/authController");

router.route("/").post(authentication, createComment)
router.route("/").get(authentication, postComments);

router.route("/:id").patch(authentication, updateCommentById);
router.route("/:id").delete(authentication, deleteCommentById);
module.exports = router;
