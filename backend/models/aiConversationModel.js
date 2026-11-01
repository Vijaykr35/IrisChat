import mongoose from "mongoose";

const aiConversationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        default: "New Chat"
    },
    messages: [
        {
            role: {
                type: String,
                enum: ["user", "model"],
                required: true
            },
            text: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, {
    timestamps: true
});

const AIConversation = mongoose.model("AIConversation", aiConversationSchema);
export default AIConversation;

