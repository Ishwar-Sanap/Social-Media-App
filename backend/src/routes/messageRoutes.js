import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getChatMessages,
  getUserRecentMessages,
  sendMessage,
} from "../controllers/messageController.js";
import { upload } from "../configs/multer.js";

const messageRouter = express.Router();

messageRouter.post("/send", protect, upload.single("image"), sendMessage);
messageRouter.get("/chats/:userId", protect, getChatMessages);
messageRouter.get("/recents", protect, getUserRecentMessages);

export default messageRouter;