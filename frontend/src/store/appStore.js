import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../store/themeSlice";
import userReducer from "../store/userSlice"

const appStore = configureStore({
  reducer: {
    theme: themeReducer,
    user : userReducer
  },
});

export default appStore;
