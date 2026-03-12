import { createSlice } from "@reduxjs/toolkit";

const feedPostsSlice = createSlice({
  name: "feedPosts",
  initialState: {
    posts: [],
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    updatePostLike: (state, action) => {
      const { postId, userId } = action.payload;
      const postDetails = state.posts.find((post) => post._id === postId);

      if (postDetails && postDetails.likes_count) {
        if (!postDetails.likes_count.includes(userId))
          postDetails.likes_count.push(userId);
        else
          postDetails.likes_count = postDetails.likes_count.filter(
            (uid) => uid !== userId,
          );
      }
    },
    deletePost: (state, action) => {
      const { postId } = action.payload;
      state.posts = state.posts.filter((post) => post._id !== postId);
    },
  },
});

export const { setPosts, updatePostLike, deletePost } = feedPostsSlice.actions;
export default feedPostsSlice.reducer;
