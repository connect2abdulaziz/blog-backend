import express, { Router } from 'express';
import userRouter from './user.route';
import postRouter from './post.route';
import commentRouter from './comment.route';

const router: Router = express.Router();

// Use the routers
router.use('/users', userRouter);
router.use('/posts', postRouter);
router.use('/comments', commentRouter);

export default router;
