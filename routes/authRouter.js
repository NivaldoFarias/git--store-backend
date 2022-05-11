import { Router } from 'express';

import { register } from '../controllers/authController.js';

const authRouter = Router();

authRouter.post('/auth/sign-up', register);

export default authRouter;
