import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 3,
  reconnectionDelay: 2000,
});

socket.on("connect_error", () => {
//   console.log("Server down");
});
export default socket;
