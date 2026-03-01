import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token)
      return res.status(401).json({ success: false, message: "Please login!" });

    const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decodedObj;
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    req.user = user; //adding user in req payload for further use
    next(); // calling next request handler
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
