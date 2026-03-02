import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import validator from "validator";
const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 30,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 3,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String },
    bio: { type: String, maxLength: 300, trim: true },
    profile_picture: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) throw new Error("Photo URL is invalid");
      },
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    cover_photo: {
      type: String,
      default: "",
      validate(value) {
        if (!validator.isURL(value)) throw new Error("Photo URL is invalid");
      },
    },
    location: { type: String, default: "", maxLength: 30 },
    followers: [{ type: String, ref: "User" }],
    following: [{ type: String, ref: "User" }],
    connections: [{ type: String, ref: "User" }],
  },
  { timestamps: true, minimize: false },
);

userSchema.methods.getJWT = function () {
  //Note in userSchema methods always use noraml function, since we required this
  // and this can't be used in arrow function
  const user = this;
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  }); // userID is encoded and stored the the jwtToken string

  return token;
};

const User = mongoose.model("User", userSchema);

export default User;
