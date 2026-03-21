import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
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
        error.customMessage = "Unauthorized user, Please login!";
      }

      if (error.response.status === 500) {
        error.customMessage = "Server error";
      }
    } else if (error.request) {
      // Request sent but no response
      error.customMessage = "Network error, server not responding";
    } else {
      error.customMessage = error.message;
    }
    return Promise.reject(error);
  },
);

export default API;