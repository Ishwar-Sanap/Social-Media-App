import Post from "../models/Post.js";
import User from "../models/User.js";
import { validateEditRequestData } from "../utils/dataValidations.js";
import {uploadImageOnImageKit} from "../utils/uploadOnImageKit.js";
export const getUserProfile = async (req, res) => {
  try {
    const loggedInUser = req.user;

    res.json({ success: true, user: loggedInUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getProfileDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const userProfile = await User.findById(userId);
    if (!userProfile) throw new Error("User not found");

    const posts = await Post.find({ user: userProfile._id }).sort({ createdAt: -1 });;
    res.json({ success: true, profile: userProfile, posts });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const editUserProfile = async (req, res) => {
  try {
    //Allowed fields to edit : full_name, username, bio, profile_picture , cover_photo, location
    if (!validateEditRequestData(req.body))
      throw new Error("Invalid edit request");

    //Updating user object
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    //Profile and Cover image files parse through multer middleware
    const profileImg =
      req.files?.profile_picture && req.files.profile_picture[0];
    const coverImg = req.files?.cover_photo && req.files.cover_photo[0];

    if (profileImg) {
      const imgUrl = await uploadImageOnImageKit(
        profileImg,
        "Profile_Pics",
        512,
      );
      loggedInUser.profile_picture = imgUrl;
    }
    if (coverImg) {
      const imgUrl = await uploadImageOnImageKit(
        coverImg,
        "Cover_Photos",
        1280,
      );
      loggedInUser.cover_photo = imgUrl;
    }

    //save updated user into DB
    const user = await loggedInUser.save();

    res.json({ success: true, user, message: "Profile updated successfully" });
  } catch (error) {
    if (error.name === "MongoServerError" && error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const errorMessage = `Error : The ${field} '${error.keyValue[field]}' already exists.`;
      res.status(400).json({ success: false, message: errorMessage });
    } else {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

export const discoverUsersProfile = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { search } = req.query;
    const searchRegex = new RegExp(search, "i"); // case Insensitive seraching for search text that can appears anywhere in [username, full_name, or location]
    const allUsers = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: searchRegex } },
            { full_name: { $regex: searchRegex } },
            { location: { $regex: searchRegex } },
          ],
        },
        { _id: { $ne: loggedInUser._id } },
      ],
    });
    const message = `Number of users found ${allUsers.length}`;
    res.json({ success: true, data: allUsers, message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const followUser = async (req, res) => {
  try {
    //LoggedIn user (A) want to follow the user (B) with userId
    const { userId } = req.params;
    const loggedInUser = req.user;
    const toUser = await User.findById(userId);

    if (!toUser) throw new Error("User not found");

    if (loggedInUser.following.includes(userId))
      throw new Error("You are already following this user");

    if (userId === loggedInUser._id.toString())
      throw new Error("Can not follow to yourself");

    loggedInUser.following.push(userId); // A Following to B
    await loggedInUser.save();

    toUser.followers.push(loggedInUser._id); // A is Follower of B
    await toUser.save();

    const message = `You are now following '${toUser.full_name}'`;

    res.json({ success: true, message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
export const unFollowUser = async (req, res) => {
  try {
    //LoggedIn user (A) want to UnFollow the user (B) with userId
    const { userId } = req.params;
    const loggedInUser = req.user;
    const toUser = await User.findById(userId);

    if (!toUser) throw new Error("User not found");

    if (!loggedInUser.following.includes(userId))
      throw new Error("You are not following this user");

    if (userId === loggedInUser._id.toString())
      throw new Error("Can not Unfollow to yourself");

    // A Unfollow B
    loggedInUser.following = loggedInUser.following.filter(
      (id) => id.toString() !== userId,
    );
    await loggedInUser.save();

    // A is not Followers of B
    toUser.followers = toUser.followers.filter(
      (id) => id.toString() !== loggedInUser._id.toString(),
    );
    await toUser.save();

    const message = `You are no longer following '${toUser.full_name}'`;

    res.json({ success: true, message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const removeFollower = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { userId } = req.params;

    if (!loggedInUser.followers.includes(userId))
      throw new Error("This User is not your follower");


    loggedInUser.followers = loggedInUser.followers.filter(
      (uid) => uid.toString() !== userId,
    );

    await loggedInUser.save();

    const toUser = await User.findById(userId);

    toUser.following = toUser.following.filter(
      (uid) => uid.toString() !== loggedInUser._id.toString(),
    );

    await toUser.save();

    res.json({
      success: true,
      message: `Successfully removed follower '${toUser.full_name}'`,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
