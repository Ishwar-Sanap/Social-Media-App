import API from "./axiosConfig";

export const getProfile = () => API.get("/profile/view");
