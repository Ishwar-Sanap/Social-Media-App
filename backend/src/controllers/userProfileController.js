import { validateEditRequestData } from "../utils/dataValidations.js";
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

    //save updated user intto DB
    const user = await loggedInUser.save();
    res.json({ success: true, user, message: "Profile updated successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
