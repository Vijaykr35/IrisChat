import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import groupRoute from "./routes/groupRoute.js";
import aiRoute from "./routes/aiRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./socket/socket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded regardless of working directory
dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config();

const PORT = process.env.PORT || 8080;

//middlewares
const FrontendUrl = process.env.FRONTENDURL || "http://localhost:5173";

app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
const corsOptions = {
    origin: FrontendUrl,
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

//routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/group", groupRoute);
app.use("/api/v1/ai", aiRoute);

server.listen(PORT, () => {
    connectDB();
});
