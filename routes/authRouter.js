import { Router } from 'express';

import * as auth from '../controllers/authController.js';
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
  auth.signUp
);
authRouter.post(
  '/api/auth/sign-in',
  validateSignInSchema,
  findUser,
  validatePassword,
  createToken,
  auth.signIn
);

export default authRouter;
