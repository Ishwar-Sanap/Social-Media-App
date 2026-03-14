import API from "./axiosConfig";

export const createStory = (formData) => API.post("/story/create", formData);
export const getStories = () => API.get("/story/get");
export const seenStory = (storyId) => API.post("/story/seen/" + storyId);
