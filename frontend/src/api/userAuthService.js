import API from "./axiosConfig";

export const loginUser = (data) => API.post("/login", data, { withCredentials: true });
