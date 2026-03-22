import User from "../models/User.js";
import bcrypt from "bcrypt";
import {
  validatePassword,
  validateSignupData,
} from "../utils/dataValidations.js";

//sign-up new user to platform
export const signupUser = async (req, res) => {
  try {
    validateSignupData(req.body);
    const { full_name, username } = req.body;
    const hashPassword = await bcrypt.hash(req.body?.password, 10);
    const user = await User.create({
      full_name,
      username,
      email: req.body?.email,
      password: hashPassword,
    });
    //sending the JWT Token through cookies after succesfully sign up
    const jwtToken = user.getJWT();
    res.cookie("token", jwtToken, { secure: true,sameSite: "none" });
    const { email, password, ...selectedFields } = user.toObject();
    res.json({ success: true, user: selectedFields });
  } catch (error) {
    if (error.name === "MongoServerError" && error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const errorMessage = `The ${field} '${error.keyValue[field]}' already exists.`;
      res.status(400).json({ success: false, message: errorMessage });
    } else {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, email:userEmail, password: userEnterPassword } = req.body;
    const user = await User.findOne({ $or: [{ email:userEmail }, { username }] });
    if (!user) throw new Error("Invalid credentials");
    const isValidPassword = await validatePassword(userEnterPassword, user.password);
    if (!isValidPassword) throw new Error("Invalid credentials");

    //sending the JWT Token through cookies after succesfully logged in
    const jwtToken = user.getJWT();
    res.cookie("token", jwtToken);
    const { email, password, ...selectedFields } = user.toObject();
    res.json({ success: true, user: selectedFields });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logOutUser = async (req, res) => {
  try {
    //clear the cookies, tokens and send success..
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.json({ success: true, message: "logout successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
