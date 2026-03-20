import { createSlice } from "@reduxjs/toolkit";

const recentMessagesSlice = createSlice({
  name: "recentMessages",
  initialState: [],
  reducers: {
    addMessages: (state, action) => {
      return action.payload;
    },
    removeRecentMessages: (state, action) => {
      const updatedMessage = state.filter(
        (msg) => msg.from_user_id._id !== action.payload,
      );
      return updatedMessage;
    },
  },
});

export const { addMessages, removeRecentMessages } =
  recentMessagesSlice.actions;
export default recentMessagesSlice.reducer;
