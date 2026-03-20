import { markMessageAsSeen } from "./controllers/messageController.js";

const socketHandler = (io) => {
  io.on("connection", (clientSocket) => {
    // console.log("Client connected : ", clientSocket.id);

    clientSocket.on("join_user_room", (userRoomId) => {
      clientSocket.join(userRoomId);
    });
    clientSocket.on("join_chat_room", (chatRoomId) => {
      clientSocket.join(chatRoomId); // joins the rooms
    });

    clientSocket.on("leave_chat_room", (chatRoomId) => {
      clientSocket.leave(chatRoomId);
    });

    clientSocket.on("msg_seen", (msgData)=>{
      markMessageAsSeen(msgData);
    })
    clientSocket.on("disconnect", () => {
      // automatically removes from all the rooms.
    });
  });
};

export default socketHandler;
