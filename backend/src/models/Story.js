import mongoose from "mongoose";
import validator from "validator";

const storySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    content: { type: String, maxLength: 300 },
    media_url: {
      type: String,
    },

    media_type: {
      type: String,
      enum: ["text", "image", "video"],
      required: true,
    },
    views_count: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    background_color: { type: String },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index : TTL = automatic document deletion based on time
    },
  },
  { timestamps: true, minimize: false },
);

const Story = mongoose.model("Story", storySchema);

export default Story;
