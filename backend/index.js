import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import messageRoute from "./routes/messageRoute.js";
import cors from "cors";
import { app, server } from "./socket/socket.js";
dotenv.config({});

const PORT = process.env.PORT || 3000;

//middlewares

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

//routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);
app.listen(PORT, () => {
    connectDB();
    console.log("server started at port", PORT);
});
