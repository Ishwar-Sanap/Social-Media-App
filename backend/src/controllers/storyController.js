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
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    res.json({ success: true, message: "Story created successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getStories = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const selectedUserDetails = "full_name username profile_picture";
    //User can see Stories from loggedInuser,  connected  or following users on Feed
    const userIds = [
      loggedInUser._id,
      ...loggedInUser.connections,
      ...loggedInUser.following,
    ];

    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const stories = await Story.find({
      user: { $in: userIds },
      expiresAt: { $gt: new Date() },
    })
      .populate("user", selectedUserDetails)
      .sort({ createdAt: -1 }); // sort in descending order of createdAt (newest story first)

    if (stories.length === 0) throw new Error("No stories found");

    //Find all oweners of each stories

    // {userId1 : [{}, {}, {}] , userId2 : [{}, {}, {}]}
    const userStoriesMap = {};
    const userDetailsMap = {};
    stories.map((story) => {
      const userId = story.user._id;
      const { user, ...storyData } = story.toObject(); //convert into plain js object
      if (userStoriesMap[userId]) {
        userStoriesMap[userId].push(storyData);
      } else {
        userStoriesMap[userId] = [storyData];
      }
      userDetailsMap[userId] = user;
    });

    const data = [];

    Object.keys(userStoriesMap).forEach((userId) => {
      const stories = userStoriesMap[userId];
      data.push({ ...userDetailsMap[userId], stories });
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const viewStory = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { storyId } = req.params;
    const selectedUserDetails = "full_name username profile_picture";
    const story = await Story.findById(storyId).populate("user", selectedUserDetails);
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
