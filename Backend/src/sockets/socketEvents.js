const handleSocketEvents = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Handle signaling data here
    socket.on("signal", (data) => {
      io.to(data.to).emit("signal", {
        from: socket.id,
        signal: data.signal,
      });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

export default handleSocketEvents;
