import express from "express";
import { protect } from "../middleware/auth.js";
import { addUserStory, getStories, viewStory } from "../controllers/storyController.js";
import { upload } from "../configs/multer.js";
const storyRouter = express.Router();

storyRouter.post("/create", protect, upload.single("media"), addUserStory);
storyRouter.get("/get", protect, getStories);
storyRouter.post("/seen/:storyId", protect, viewStory)

export default storyRouter;