import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

//Handling Networks error globally..
API.interceptors.response.use(
  (response) => {
    return response; // successful response
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 401) {
        console.error("Unauthorized user. Please login!");
      }

      if (error.response.status === 500) {
        console.error("Server error");
      }
    } else if (error.request) {
      // Request sent but no response
      console.error("Network error. Server not responding.");
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default API;