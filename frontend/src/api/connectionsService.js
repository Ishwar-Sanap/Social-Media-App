import API from "./axiosConfig";

export const fetchConnectionsData = () => API.get("/request/connections");
export const sendConnectionRequest = (userId) => API.post("/request/connect/"+userId)
export const acceptConnectionRequest = (userId) => API.post("/request/accept/"+userId);
export const rejectConnectionRequest = (userId) => API.post("/request/reject/"+userId);
export const removeConnection = (userId) => API.post("/request/remove/connection/"+userId);