import express from 'express';

import sessionRouter from './sessionRouter.js';
import authRouter from './authRouter.js';

const router = express.Router();

router.use(sessionRouter);
router.use(authRouter);

export default router;
