import API from "./axiosConfig";

export const fetchFeedData = () => API.get("/post/feed");
export const createPost = (formData) => API.post("/post/create", formData);
export const deletePost = (postId) => API.post("/post/delete/" + postId);
export const likePost = (postId) => API.post("/post/like/" + postId);