import express from 'express';
import dotenv from 'dotenv';

import * as middleware from '../middlewares/sessionMiddleware.js';
import * as session from '../controllers/sessionController.js';

dotenv.config();

const userRouter = express.Router();
userRouter.get('/api/products', session.getProducts);
userRouter.post(
  '/api/session/purchase',
  middleware.requireToken,
  middleware.validatePurchase,
  middleware.isUserOnline,
  middleware.userExists,
  middleware.itemsExists,
  middleware.areItemsInStock,
  session.purchase,
);
export default userRouter;
