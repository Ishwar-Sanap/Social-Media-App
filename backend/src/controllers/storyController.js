import Story from "../models/Story.js";
import { uploadMediaOnImageKit } from "../utils/uploadOnImageKit.js";

export const addUserStory = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { content, media_type, background_color } = req.body;

    const media = req.file;

    let media_url = "";
    if (media_type === "image" || media_type === "video") {
      //Upload image/video on ImageKit
      media_url = await uploadMediaOnImageKit(media, "Stories");
    }

    await Story.create({
      user: loggedInUser._id,
      content,
      media_type,
      media_url,
      background_color,
    });

    res.json({ success: true, message: "Story created successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getStories = async (req, res) => {
  try {
    const loggedInUser = req.user;

    //User can see Stories from loggedInuser,  connected  or following users on Feed
    const userIds = [
      loggedInUser._id,
      ...loggedInUser.connections,
      ...loggedInUser.followers,
    ];

    const stories = await Story.find({ user: { $in: userIds } })
      .populate("user")
      .sort({ createdAt: -1 }); // sort in descending order of createdAt (newest story first)

    if (stories.length === 0) throw new Error("No stories found");

    res.json({ success: true, stories });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const viewStory = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { storyId } = req.params;

    const story = await Story.findById(storyId).populate("user");
    if (!story) throw new Error("No story found");

    if (
      !story.user.equals(loggedInUser._id) &&
      !story.views_count.includes(loggedInUser._id)
    ) {
      story.views_count.push(loggedInUser._id);

      await story.save();
    }
    res.json({ success: true, story });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//TO-DO : Deleting the user Story after 24hrs
