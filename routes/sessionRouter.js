import express from 'express';
import dotenv from 'dotenv';

import * as middleware from '../middlewares/sessionMiddleware.js';
import * as session from '../controllers/sessionController.js';

dotenv.config();

const sessionRouter = express.Router();
sessionRouter.get('/api/products', session.getProducts);
sessionRouter.post(
  '/api/session/purchase',
  middleware.requireToken,
  middleware.validatePurchase,
  middleware.isUserOnline,
  middleware.userExists,
  middleware.itemsExists,
  middleware.areItemsInStock,
  session.purchase
);
sessionRouter.get('/api/sessions', middleware.requireToken, session.userOnline);

sessionRouter.get(
  '/api/session/cart',
  middleware.requireToken,
  session.getCart
);
sessionRouter.put(
  '/api/session/cart',
  middleware.requireToken,
  session.updateCart
);
export default sessionRouter;
