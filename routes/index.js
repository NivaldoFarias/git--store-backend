import express from 'express';

import userRouter from './userRouter.js';
import authRouter from './authRouter.js';

const router = express.Router();

router.use(userRouter);
router.use(authRouter);

export default router;
