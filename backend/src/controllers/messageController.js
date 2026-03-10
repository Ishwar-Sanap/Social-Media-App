import Message from "../models/Message.js";
import { uploadImageOnImageKit } from "../utils/uploadOnImageKit.js";

export const sendMessage = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { to_user_id, text } = req.body;
    const image = req.file;

    let media_url = "";
    let message_type = image ? "image" : "text";
    if (message_type === "image") {
      media_url = await uploadImageOnImageKit(image, "Messages_Media", 1280);
    }

    const message = await Message.create({
      from_user_id: loggedInUser._id,
      to_user_id,
      text,
      media_url,
      message_type,
    });

    //ToDO : Sending message to to_user_id using WebSockets

    res.json({ success: true, message });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { to_user_id } = req.params;
    const messages = await Message.find({
      $or: [
        { from_user_id: loggedInUser._id, to_user_id },
        { from_user_id: to_user_id, to_user_id: loggedInUser._id },
      ],
    }).sort({ createdAt: -1 });

    //Mark message seen
    await Message.updateMany(
      { from_user_id: to_user_id, to_user_id: loggedInUser._id },
      { seen: true },
    );

    res.json({ success: true, messages });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

export const getUserRecentMessages = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const messages = await Message.find({
      to_user_id: loggedInUser._id,
    })
      .populate("from_user_id to_user_id")
      .sort({ createdAt: -1 });

    res.json({ success: true, messages });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};
