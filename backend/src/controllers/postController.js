import Post from "../models/Post.js";
import uploadImageOnImageKit from "../utils/uploadOnImageKit.js";

export const createPost = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { content, post_type } = req.body;
    const images = req.files; // images will be in files, that are parsed by multer

    let image_urls = [];

    if (images.length) {
      image_urls = await Promise.all(
        images.map(async (image) => {
          const imgUrl = await uploadImageOnImageKit(image, "Posts", 1280);
          return imgUrl;
        }),
      );
    }
    await Post.create({
      user: loggedInUser._id,
      content,
      image_urls,
      post_type,
    });

    res.json({ success: true, message: "Post created successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const loggedInUser = req.user;

    //In feed user can see only post from loggedInuser,  connected  or following users
    const userIds = [
      loggedInUser._id,
      ...loggedInUser.connections,
      ...loggedInUser.followers,
    ];

    const posts = await Post.find({ user: { $in: userIds } })
      .populate("user")
      .sort({ createdAt: -1 }); // sort in descending order of createdAt (newest post first)

    if (posts.length === 0) throw new Error("No posts found");

    res.json({ success: true, posts });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) throw new Error("No post found");

    //If already liked then unlike the post
    if (post.likes_count.includes(loggedInUser._id)) {
      post.likes_count = post.likes_count.filter(
        (uid) => uid.toString() !== loggedInUser._id.toString(),
      );
      await post.save();
      res.json({ success: true, message: "Post unliked" });
    } else {
      post.likes_count.push(loggedInUser._id);
      await post.save();
      res.json({ success: true, message: "Post liked" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { postId } = req.params;
  
    const post = await Post.findOneAndDelete({
      _id: postId,
      user: loggedInUser._id,
    });
    if (!post) throw new Error("Post not found");

    res.json({ success: true, message: "Post deleted successfully" });
    Post.de;
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
