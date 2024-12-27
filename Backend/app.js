import express, { json } from "express";
import cors from "cors";
import { connectToDatabase } from "./constants.js";
import HTTPS from "https";
import fs from "fs";
import { Server } from "socket.io";

const app = express();
app.use(cors());
app.use(json());

// MongoDB Connection
connectToDatabase();

// HTTPS Server Setup
const server = HTTPS.createServer(
  {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH),
  },
  app
);
//importing routes
import userRouter from './src/Routes/user.routes.js'; // Adjust the path accordingly

//using routes
app.use('/api/users', userRouter);

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: "https://your-frontend-domain.com",
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

// Export the server and io for use in index.js
export { server, io };
