import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getReceiverSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";

export async function sendMessage(req, res) {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ message: "Message content cannot be empty", success: false });
        }

        // 1. Create message in DB first so we have the official _id and timestamp
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message: message.trim(),
        });

        // 2. Find or create strictly 1-to-1 conversation (exclude groups)
        let gotConversation = await Conversation.findOne({
            isGroup: { $ne: true },
            participants: { $all: [senderId, receiverId], $size: 2 },
        });

        if (!gotConversation) {
            gotConversation = await Conversation.create({
                isGroup: false,
                participants: [senderId, receiverId],
                messages: []
            });
        }

        gotConversation.messages.push(newMessage._id);
        await gotConversation.save();

        // 3. Emit socket event with full message object to receiver
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return res.status(201).json({ success: true, newMessage });

    } catch (error) {
        console.error("Message Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getMessage(req, res) {
    try {
        const receiverId = req.params.id;

        // Strictly fetch 1-to-1 conversation (exclude groups)
        const conversation = await Conversation.findOne({
            isGroup: { $ne: true },
            participants: { $all: [req.id, receiverId], $size: 2 },
        }).populate("messages");

        if (!conversation) {
            return res.status(200).json({ success: true, messages: [] });
        }

        return res.status(200).json({ success: true, messages: conversation.messages || [] });
    }
    catch (error) {
        console.error("Error in getMessage:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
