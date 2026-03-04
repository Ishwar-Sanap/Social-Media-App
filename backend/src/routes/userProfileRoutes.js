import express from "express";
import {
  discoverUsersProfile,
  editUserProfile,
  getUserProfile,
  followUser,
  unFollowUser,
  removeFollower,
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

userProfileRouter.get("/profile/discover", protect, discoverUsersProfile)
userProfileRouter.post("/profile/follow/:userId", protect, followUser)
userProfileRouter.post("/profile/unfollow/:userId", protect, unFollowUser)
userProfileRouter.post("/remove/follower/:userId", protect, removeFollower)

export default userProfileRouter;
