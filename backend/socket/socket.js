import http from 'http';
import { Server } from 'socket.io';
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"], // your React frontend URL
    }
});

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

const userSocketMap = {}; // Map to store user IDs with their corresponding socket IDs

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // You can add socket event handlers here
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);

        // Remove the user's socket ID from the map when the user disconnects
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

});

server.listen(8000, () => console.log("Socket.IO server running on port 8000")); // ✅ Don't forget this!
export { app, io, server };


