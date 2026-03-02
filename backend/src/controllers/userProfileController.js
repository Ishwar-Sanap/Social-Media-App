import { validateEditRequestData } from "../utils/dataValidations.js";
import uploadImageOnImageKit from "../utils/uploadOnImageKit.js";
export const getUserProfile = async (req, res) => {
  try {
    const user = req.user;

    res.json({ success: true, user });
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
    const profileImg = req.files.profile_picture && req.files.profile_picture[0];
    const coverImg = req.files.cover_photo && req.files.cover_photo[0];

    if (profileImg) {
      const imgUrl = await uploadImageOnImageKit(profileImg, 512);
      loggedInUser.profile_picture = imgUrl;
    }
    if (coverImg) {
      const imgUrl = await uploadImageOnImageKit(coverImg, 1280);
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
