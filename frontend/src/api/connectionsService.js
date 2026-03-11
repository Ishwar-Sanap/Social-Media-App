import API from "./axiosConfig";

export const fetchConnectionsData = () => API.get("/request/connections");
export const sendConnectionRequest = (userId) => API.post("/request/connect/"+userId)