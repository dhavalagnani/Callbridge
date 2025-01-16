import express, { json } from "express";
import cors from "cors";
import { connectToDatabase } from "./constants.js";
import HTTPS from "https";
import fs from "fs";
import setupSocket from "./src/sockets/socket.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
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

// Importing routes
import userRouter from "./src/Routes/user.routes.js"; // Adjust the path accordingly

// Using routes
app.use("/api/users", userRouter);

// Socket.IO Setup
const io = setupSocket(server); // Initialize socket setup

// Export the server and io for use in index.js
export { server, io };
