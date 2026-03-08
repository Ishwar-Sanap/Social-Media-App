import API from "./axiosConfig";

export const loginUser = (data) => API.post("/login", data);

export const signupUser = (data) => API.post("/signup", data);

export const logoutUser = () => API.post("/logout", {});
