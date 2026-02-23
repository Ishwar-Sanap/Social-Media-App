import { createSlice } from "@reduxjs/toolkit";
import React from "react";
import { loadTheme, saveTheme } from "../utils/saveTheme";

const themeSlice = createSlice({
  name: "theme",
  initialState: loadTheme(),
  reducers: {
    setTheme: (state, action) => {
      saveTheme(action.payload);
      return action.payload;
    },
  },
});

export const {setTheme} = themeSlice.actions;
export default themeSlice.reducer;
