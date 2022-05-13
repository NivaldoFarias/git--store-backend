import express from "express";
import dotenv from "dotenv";

import { requireToken, isUserOnline } from "./../middlewares/cartMiddleware.js";
import * as user from "../controllers/userController.js";

dotenv.config();

const userRouter = express.Router();
userRouter.get("/api/users/all", user.getAll);
userRouter.get("/api/users/cart", requireToken, isUserOnline, user.getCart);
userRouter.put("/api/users/cart", requireToken, isUserOnline, user.updateCart);
export default userRouter;
