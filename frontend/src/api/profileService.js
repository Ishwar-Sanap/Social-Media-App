import API from "./axiosConfig";

export const getProfile = () => API.get("/profile/view");
export const fetchProfileDetails = (profileId) => API.get(`/profile/details/${profileId}`);
export const discoverProfileDetails = (searchText) => API.get(`/profile/discover/?search=${searchText}`)
export const saveProfileDetails = (data) => API.patch("/profile/edit" ,data)
export const followUser = (userId) => API.post("/profile/follow/"+userId)