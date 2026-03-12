import { createSlice } from "@reduxjs/toolkit";

const userPostsSlice = createSlice({
  name: "userPosts",
  initialState: {
    posts: [],
  },
  reducers: {
    setUserPosts: (state, action) => {
      state.posts = action.payload;
    },
    updateUserPostLike: (state, action) => {
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
    deleteUserPost: (state, action) => {
      const { postId } = action.payload;
      state.posts = state.posts.filter((post) => post._id !== postId);
    },
  },
});

export const { setUserPosts, updateUserPostLike, deleteUserPost } =
  userPostsSlice.actions;
export default userPostsSlice.reducer;
