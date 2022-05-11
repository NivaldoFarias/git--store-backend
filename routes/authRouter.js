import { Router } from 'express';
// controllers
import { register, login } from '../controllers/authController.js';
// middlewares
import {
  validateSignUpSchema,
  validateEmail,
} from '../middlewares/signUpMiddleware.js';
import {
  validateSignInSchema,
  findUser,
  validatePassword,
  createToken,
} from '../middlewares/signInMiddleware.js';

const authRouter = Router();

authRouter.post(
  '/api/auth/sign-up',
  validateSignUpSchema,
  validateEmail,
  register
);
authRouter.post(
  '/api/auth/sign-in',
  validateSignInSchema,
  findUser,
  validatePassword,
  createToken,
  login
);

export default authRouter;
