import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getReceiverSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";
export async function sendMessage(req, res) {
    try {
        const senderId = req.id;
        const receiverId = req.params.id; // Fixed spelling here
        const { message } = req.body;

        let gotConversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }, // Fixed spelling here
        });

        if (!gotConversation) {
            gotConversation = await Conversation.create({
                participants: [senderId, receiverId], // Fixed spelling here
            });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId, // Fixed spelling here
            message,
        });

        if (newMessage) {
            gotConversation.messages.push(newMessage._id);
        }

        await gotConversation.save();
        // console.log(message);
        // socketId is pending
        const receiverSocketId = getReceiverSocketId(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return res.status(201).json({ newMessage });
    } catch (error) {
        console.log(`Error in message controller hsjdhsjd:: ${error}`);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export async function getMessage(req, res) {
    try {
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({
            participants: { $all: [req.id, receiverId] },
        }).populate("messages");

        // console.log(conversation);
        return res.status(200).json({ messages: conversation.messages });
    }
    catch (error) {

    }

}