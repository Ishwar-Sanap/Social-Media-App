import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../store/themeSlice";
import userReducer from "../store/userSlice"
import feedPostsReducer from "../store/feedPostsSlice"
import userPostsReducer from "../store/userPostsSlice"

const appStore = configureStore({
  reducer: {
    theme: themeReducer,
    user : userReducer,
    feedPosts: feedPostsReducer,
    userPosts : userPostsReducer
  },
});

export default appStore;
