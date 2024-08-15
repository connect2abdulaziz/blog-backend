import express from 'express';
import userRouter from './userRoute.js';
import postRouter from './postRoute.js';
import commentRouter from './commentRoute.js';

const router = express.Router();

// Use the routers
router.use('/users', userRouter);
router.use('/posts', postRouter);
router.use('/comments', commentRouter);

export default router;
