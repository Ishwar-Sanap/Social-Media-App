import API from "./axiosConfig";

export const fetchFeedData = () => API.get("/post/feed")