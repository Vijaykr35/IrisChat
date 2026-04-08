import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getReceiverSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";
export async function sendMessage(req, res) {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        // ----- 1. Create a temporary message object for instant socket emit -----
        const tempMsg = {
            senderId,
            receiverId,
            message,
            createdAt: new Date(),
        };

        // ----- 2. Emit socket right away (NO DB WAITING) -----
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", tempMsg);
        }

        // ----- 3. Now handle DB writes asynchronously -----
        let gotConversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!gotConversation) {
            gotConversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message,
        });

        gotConversation.messages.push(newMessage._id);
        await gotConversation.save();

        return res.status(201).json({ newMessage });

    } catch (error) {
        console.log("Message Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getMessage(req, res) {
    try {
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({
            participants: { $all: [req.id, receiverId] },
        }).populate("messages");

        if (!conversation) {
            return res.status(200).json({ messages: [] });
        }

        // console.log(conversation);
        return res.status(200).json({ messages: conversation.messages });
    }
    catch (error) {
        console.log("Error in getMessage:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

}