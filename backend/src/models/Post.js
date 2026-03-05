import mongoose from "mongoose";
import validator from "validator";

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    content: { type: String, maxLength: 300 },
    image_urls: [
      {
        type: String,
        validate(value) {
          if (!validator.isURL(value)) throw new Error("Image URL is invalid");
        },
      },
    ],
    post_type: {
      type: String,
      enum: ["text", "image", "text_with_image"],
      required: true,
    },
    likes_count: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true, minimize: false },
);

const Post = mongoose.model("Post", postSchema);

export default Post;
