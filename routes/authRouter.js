import { Router } from 'express';
// controllers
import { register } from '../controllers/authController.js';
// middlewares
import {
  validateSignUp,
  validateEmail,
} from '../middlewares/validationMiddleware.js';

const authRouter = Router();

authRouter.post('/api/auth/sign-up', validateSignUp, validateEmail, register);

export default authRouter;
