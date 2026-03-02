import express from "express";
import {
  editUserProfile,
  getUserProfile,
} from "../controllers/userProfileController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../configs/multer.js";

const userProfileRouter = express.Router();

userProfileRouter.get("/profile/view", protect, getUserProfile);
userProfileRouter.patch(
  "/profile/edit",
  protect,
  upload.fields([
    { name: "profile_picture", maxCount: 1 },
    { name: "cover_photo", maxCount: 1 },
  ]),
  editUserProfile,
);

export default userProfileRouter;
