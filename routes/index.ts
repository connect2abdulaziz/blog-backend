import express, { Router } from 'express';
import userRouter from './userRoute';
import postRouter from './postRoute';
import commentRouter from './commentRoute';

const router: Router = express.Router();

// Use the routers
router.use('/users', userRouter);
router.use('/posts', postRouter);
router.use('/comments', commentRouter);

export default router;
