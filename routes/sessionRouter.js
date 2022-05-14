import express from 'express';
import dotenv from 'dotenv';

import {
  requireToken,
  isUserOnline,
  userExists,
  itemsExists,
  areItemsInStock,
} from '../middlewares/sessionMiddleware.js';
import * as session from '../controllers/sessionController.js';

dotenv.config();

const userRouter = express.Router();
userRouter.get('/api/products', session.getProducts);
userRouter.post(
  '/api/session/purchase',
  requireToken,
  userExists,
  isUserOnline,
  itemsExists,
  areItemsInStock,
  session.purchase,
);
export default userRouter;
