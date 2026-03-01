import express from "express";
import {
  loginUser,
  logOutUser,
  signupUser,
} from "../controllers/userAuthController.js";

const userAuthRouter = express.Router();

userAuthRouter.post("/signup", signupUser);
userAuthRouter.post("/login", loginUser);
userAuthRouter.post("/logout", logOutUser);

export default userAuthRouter;
