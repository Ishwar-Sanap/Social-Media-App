import express from "express";
import {
  discoverUsersProfile,
  editUserProfile,
  getUserProfile,
  followUser,
  unFollowUser,
  removeFollower,
  getProfileDetails,
} from "../controllers/userProfileController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../configs/multer.js";

const userProfileRouter = express.Router();

userProfileRouter.get("/view", protect, getUserProfile);
userProfileRouter.patch(
  "/edit",
  protect,
  upload.fields([
    { name: "profile_picture", maxCount: 1 },
    { name: "cover_photo", maxCount: 1 },
  ]),
  editUserProfile,
);

userProfileRouter.get("/discover", protect, discoverUsersProfile)
userProfileRouter.post("/follow/:userId", protect, followUser)
userProfileRouter.post("/unfollow/:userId", protect, unFollowUser)
userProfileRouter.post("/remove/follower/:userId", protect, removeFollower)
userProfileRouter.get("/details/:userId", protect, getProfileDetails)

export default userProfileRouter;
