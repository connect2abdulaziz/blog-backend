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
router.route("/:userId").get(authentication, getMyPosts);

router.route("/:id").get(getPostById);
router.route("/:id/search").get(searchPosts);
router.route("/:id").patch(authentication, updatePostById);
router.route("/:id").delete(authentication, deletePostById);
module.exports = router;
