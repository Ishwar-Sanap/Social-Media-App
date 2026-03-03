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
      default:
        "https://static.vecteezy.com/system/resources/previews/025/255/734/non_2x/network-connection-with-connection-people-for-global-communication-technology-social-networking-and-global-business-background-illustration-vector.jpg",
      validate(value) {
        if (!validator.isURL(value)) throw new Error("Photo URL is invalid");
      },
    },
    location: { type: String, default: "", maxLength: 30 },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
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
