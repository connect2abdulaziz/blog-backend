const router = require("express").Router();
const userRouter = require("./userRoute");
const postRouter = require("./postRoute");
const commentRouter = require("./commentRoute");

// Define routes
router.use("/users", userRouter);
router.use("/posts", postRouter);
router.use("/comments", commentRouter);

module.exports = router;
