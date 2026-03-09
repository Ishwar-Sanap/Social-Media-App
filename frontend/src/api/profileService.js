import API from "./axiosConfig";

export const getProfile = () => API.get("/profile/view");
export const fetchProfileDetails = (profileId) => API.get(`/profile/details/${profileId}`);