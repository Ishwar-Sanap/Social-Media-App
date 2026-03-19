const socketHandler = (io) => {
  io.on("connection", (clientSocket) => {
    // console.log("Client connected : ", clientSocket.id);

    clientSocket.on("disconnect", () => {
    //   console.log("Client disconnnected : ", clientSocket.id);
    });

    clientSocket.on("join_room", (roomId) => {
      clientSocket.join(roomId); // joins the rooms
    });

    // clientSocket.on("send_msg", (data) => {
    //   //send message to only user that who joins room 1 : 1 messenging..
    //   clientSocket.to(data.roomId).emit("recv_msg", data);
    // });
  });
};

export default socketHandler;
