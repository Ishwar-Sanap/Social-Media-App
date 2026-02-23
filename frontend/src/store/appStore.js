import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../store/themeSlice";

const appStore = configureStore({
  reducer: {
    theme: themeReducer,
  },
});

export default appStore;
