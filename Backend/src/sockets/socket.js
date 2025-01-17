import { Server } from "socket.io";

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Allow requests from the frontend
      methods: ["GET", "POST"],
    },
  });

  // Socket.IO Event Handling
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

  return io;
};

export default setupSocket;
