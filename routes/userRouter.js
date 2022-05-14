import express from 'express';
import dotenv from 'dotenv';

import {
  requireToken,
  isUserOnline,
  userExists,
} from '../middlewares/userMiddleware.js';
import * as user from '../controllers/userController.js';

dotenv.config();

const userRouter = express.Router();
userRouter.get('/api/products', user.getProducts);
userRouter.put(
  '/api/user/purchase',
  requireToken,
  userExists,
  isUserOnline,
  user.purchase,
);
export default userRouter;
