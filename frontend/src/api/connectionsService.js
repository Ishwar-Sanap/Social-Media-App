import API from "./axiosConfig";

export const fetchConnectionsData = () => API.get("/request/connections");