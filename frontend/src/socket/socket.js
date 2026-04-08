import { io } from "socket.io-client";

const currentUser = JSON.parse(localStorage.getItem("user"));

const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:8080", {
    query: {
        userId: localStorage.getItem("userId") || currentUser._id
    }
});

export default socket;
