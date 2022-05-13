import express from 'express';
import dotenv from 'dotenv';

import * as user from '../controllers/userController.js';

dotenv.config();

const userRouter = express.Router();
userRouter.get('/api/users/all', user.getAll);
userRouter.get('/api/users/cart', user.getCart);
userRouter.put('/api/users/cart', user.updateCart);
export default userRouter;
