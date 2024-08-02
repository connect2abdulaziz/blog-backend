const router = require("express").Router();
const {
  createPost,
  getPosts,
  getPostById,
  searchPosts,
  getMyPosts,
  updatePostById,
  deletePostById,
} = require("../controllers/postController");
const { authentication } = require("../middleware/auth");

router.route("/").post(authentication, createPost);
router.route("/").get(getPosts);
router.route("/:id/my-posts").get(authentication, getMyPosts);

router.route("/:id").get(getPostById);
//TODO: handle it in getPosts method when it's available
router.route("/:id/search").get(searchPosts);
router.route("/:id").patch(authentication, updatePostById);
router.route("/:id").delete(authentication, deletePostById);
module.exports = router;
