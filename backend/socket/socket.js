import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

const frontendUrl = process.env.FRONTENDURL || "http://localhost:3000";

// userId -> socketId
const userSocketMap = {};

// get receiver socketId
export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

const io = new Server(server, {
    cors: {
        origin: [frontendUrl],
        methods: ["GET", "POST"],
    },
});

// socket connection
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    const userId = socket.handshake.query.userId;

    // store user socket
    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    // send online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // disconnect event
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);

        for (const key in userSocketMap) {
            if (userSocketMap[key] === socket.id) {
                delete userSocketMap[key];
                break;
            }
        }

        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };