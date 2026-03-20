import Message from "../models/Message.js";
import { uploadImageOnImageKit } from "../utils/uploadOnImageKit.js";

export const sendMessage = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { to_user_id, text, roomId, from_user } = req.body;
    const image = req.file;

    let media_url = "";
    let from_user_obj = from_user;
    let message_type = image ? "image" : "text";
    if (message_type === "image") {
      from_user_obj = JSON.parse(from_user);
      media_url = await uploadImageOnImageKit(image, "Messages_Media", 1280);
    }

    const message = await Message.create({
      from_user_id: loggedInUser._id,
      to_user_id,
      text,
      media_url,
      message_type,
    });

    const io = req.app.get("io");

    //send notification
    const userRoomId = "user_" + to_user_id;
    io.to(userRoomId).emit("new_msg_notify", {
      ...message.toObject(),
      from_user : from_user_obj,
    });

    //Sending message to to_user_id using socket.io
    //emit message to user via socket
    io.to(roomId).emit("recv_msg", message);

    res.json({ success: true, message });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const to_user_id = req.params.userId;
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
    const selectedUserDetails = "full_name username profile_picture";
    const messages = await Message.find({
      to_user_id: loggedInUser._id,
    })
      .populate("from_user_id", selectedUserDetails)
      .sort({ createdAt: -1 });

    const userMsgsMap = {};
    const userDetailsMap = {};
    messages.map((msg) => {
      const fromUserId = msg.from_user_id._id;
      const { from_user_id, ...msgData } = msg.toObject(); //convert into plain js object
      if (userMsgsMap[fromUserId]) {
        userMsgsMap[fromUserId].push(msgData);
      } else {
        userMsgsMap[fromUserId] = [msgData];
      }
      userDetailsMap[fromUserId] = from_user_id;
    });

    const data = [];
    Object.keys(userMsgsMap).forEach((fromUserId) => {
      const unreadMsgs = userMsgsMap[fromUserId].filter((msg) => {
        return msg.seen === false;
      });
      if (unreadMsgs.length > 0) {
        data.push({
          from_user_id: { ...userDetailsMap[fromUserId] },
          last_unread_msg: unreadMsgs[0],
          cnt_unread_msgs: unreadMsgs.length,
        });
      }
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

//This function will be called when msg_seen evet is emitted.
export const markMessageAsSeen = async (msgData) => {
  try {
    const msgId = msgData._id;
    const resp = await Message.findByIdAndUpdate(
      msgId,
      { seen: true },
      { returnDocument: "after" },
    );
  } catch (error) {}
};
