import Connection from "../models/Connection.js";
import User from "../models/User.js";

export const sendConnectionRequest = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { userId } = req.params;

    const toUser = await User.findById(userId);

    //Check if user has sent more than 20 connection requests in last 24 hours
    const last24Hrs = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const connectionRequests = await Connection.find({
      from_user_id: loggedInUser._id,
      createdAt: { $gt: last24Hrs },
    });

    if (connectionRequests.length >= 20)
      return res.json({
        success: false,
        message:
          "You have sent more than 20 connection requests in last 24 hours",
      });

    if (!toUser) throw new Error("User not found, can not send request");

    if (userId === loggedInUser._id.toString())
      throw new Error("Can not send connect request to yourself");

    const existConnection = await Connection.findOne({
      $or: [
        { from_user_id: loggedInUser._id, to_user_id: userId },
        { from_user_id: userId, to_user_id: loggedInUser._id },
      ],
    });

    if (existConnection && existConnection.status === "accepted")
      throw new Error(`You are already connected to '${toUser.full_name}'`);

    if (existConnection && existConnection.status === "pending")
      throw new Error(
        `You have already pending connection request with '${toUser.full_name}'`,
      );

    const connReq = await Connection.create({
      from_user_id: loggedInUser._id,
      to_user_id: userId,
    });

    const message = `Connection request sent successfully to '${toUser.full_name}'`;
    res.json({ success: true, message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getUserConnections = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const user = await User.findById(loggedInUser._id).populate(
      "connections followers following",
    );

    const connections = user.connections;
    const followers = user.followers;
    const following = user.following;

    //How many connections are pending in loggedInUser
    const userConnections = await Connection.find({
      to_user_id: loggedInUser._id,
      status: "pending",
    }).populate("from_user_id");

    const pendingConnections = userConnections.map(
      (connection) => connection.from_user_id,
    );

    res.json({
      success: true,
      followers,
      following,
      connections,
      pendingConnections,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { userId } = req.params;

    const connection = await Connection.findOne({
      from_user_id: userId,
      to_user_id: loggedInUser._id,
    });

    if (!connection) throw new Error("Connection request not found");

    if (connection.status === "accepted")
      throw new Error("You have already accepted this request");

    //Accepting connection means both user's are now connected with each other
    loggedInUser.connections.push(userId);
    await loggedInUser.save();

    const toUser = await User.findById(userId);
    toUser.connections.push(loggedInUser._id);
    await toUser.save();

    connection.status = "accepted";
    await connection.save();

    res.json({
      success: true,
      message: `Connection request from '${toUser.full_name}' accepted successfully`,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
