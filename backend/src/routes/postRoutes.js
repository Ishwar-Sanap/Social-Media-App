import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createPost,
  getFeedPosts,
  likePost,
} from "../controllers/postController.js";

import { upload } from "../configs/multer.js";

const postRouter = express.Router();

postRouter.post("/create", protect, upload.array("images", 4), createPost);
postRouter.post("/like/:postId", protect, likePost);
postRouter.get("/feed", protect, getFeedPosts);

export default postRouter;