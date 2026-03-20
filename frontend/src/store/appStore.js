import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../store/themeSlice";
import userReducer from "../store/userSlice"
import feedPostsReducer from "../store/feedPostsSlice"
import userPostsReducer from "../store/userPostsSlice"
import recentMessagesReducer from "../store/recentMessagesSlice"

const appStore = configureStore({
  reducer: {
    theme: themeReducer,
    user : userReducer,
    feedPosts: feedPostsReducer,
    userPosts : userPostsReducer,
    recentMessages : recentMessagesReducer
  },
});

export default appStore;
