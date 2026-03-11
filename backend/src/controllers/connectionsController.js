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

    if (existConnection && existConnection.status === "pending") {
      if (existConnection.from_user_id.equals(loggedInUser._id))
        throw new Error(
          `You have already sent connection request to '${toUser.full_name}'`,
        );
      else
        throw new Error(
          `You have already pending connection request from '${toUser.full_name}'`,
        );
    }

    const connReq = await Connection.create({
      from_user_id: loggedInUser._id,
      to_user_id: userId,
    });

    //When connection request is sent, automatically follow the user if not following
    if (!loggedInUser.following.includes(userId)) {
      loggedInUser.following.push(userId);
      await loggedInUser.save();

      toUser.followers.push(loggedInUser._id);
      await toUser.save();
    }

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

    //When connection request is accepted,automatically follow back to user who have send connection request
    if (!loggedInUser.following.includes(userId)) {
      loggedInUser.following.push(userId);
      await loggedInUser.save();

      toUser.followers.push(loggedInUser._id);
      await toUser.save();
    }

    res.json({
      success: true,
      message: `Connection request from '${toUser.full_name}' accepted successfully`,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//Only reject pending requests
export const rejectConnectionRequest = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { userId } = req.params;

    //Find and delete pending connection request
    const connection = await Connection.findOneAndDelete({
      from_user_id: userId,
      to_user_id: loggedInUser._id,
      status: "pending",
    });

    if (!connection) throw new Error("Connection request not found");

    res.json({
      success: true,
      message: "Connection request rejected successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//Only remove connection when both the users are connected..
export const removeConnection = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { userId } = req.params;

    const connection = await Connection.findOneAndDelete({
      $or: [
        {
          from_user_id: loggedInUser._id,
          to_user_id: userId,
          status: "accepted",
        },
        {
          from_user_id: userId,
          to_user_id: loggedInUser._id,
          status: "accepted",
        },
      ],
    });

    if (!connection) throw new Error("Connection not found");

    //After connection is removed between user, automatically removes them from followers and following
    // So they don't have any relation with each other.

    loggedInUser.following = loggedInUser.following.filter(
      (uid) => uid.toString() !== userId,
    );
    loggedInUser.followers = loggedInUser.followers.filter(
      (uid) => uid.toString() !== userId,
    );
    loggedInUser.connections = loggedInUser.connections.filter(
      (uid) => uid.toString() !== userId,
    );

    await loggedInUser.save();

    const toUser = await User.findById(userId);

    toUser.following = toUser.following.filter(
      (uid) => uid.toString() !== loggedInUser._id.toString(),
    );
    toUser.followers = toUser.followers.filter(
      (uid) => uid.toString() !== loggedInUser._id.toString(),
    );
    toUser.connections = toUser.connections.filter(
      (uid) => uid.toString() !== loggedInUser._id.toString(),
    );

    await toUser.save();

    res.json({ success: true, message: "Connection removed succesfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
