import API from "./axiosConfig";

export const sendMessageAPI = (data) => API.post("/message/send", data);
export const fetchRecentMessagesAPI = ()=> API.get("/message/recents");
export const fetchChatMessageAPI = (userId)=> API.get("/message/chats/" + userId )