const router = require("express").Router();
const {
  createPost,
  getPosts,
  getPostById,
  updatePostById,
  deletePostById,
} = require("../controllers/postController");
const { authentication } = require("../middleware/auth");

// get all posts and create new ones
router.route("/").get(getPosts);
router.route("/:id").get(getPostById);

//protected
router.route("/").post(authentication, createPost);
router.route("/:id/my-posts").get(authentication, getPosts);
router.route("/:id").patch(authentication, updatePostById);
router.route("/:id").delete(authentication, deletePostById);
module.exports = router;
