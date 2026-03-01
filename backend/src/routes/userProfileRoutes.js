import express from "express";
import {
  editUserProfile,
  getUserProfile,
} from "../controllers/userProfileController.js";
import { protect } from "../middleware/auth.js";

const userProfileRouter = express.Router();

userProfileRouter.get("/profile/view", protect, getUserProfile);
userProfileRouter.patch("/profile/edit", protect, editUserProfile);

export default userProfileRouter;
