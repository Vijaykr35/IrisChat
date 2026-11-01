import mongoose from "mongoose";

const conversationModel = new mongoose.Schema({
    isGroup: {
        type: Boolean,
        default: false
    },
    groupName: {
        type: String,
        default: ""
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    groupPhoto: {
        type: String,
        default: ""
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    }]
}, {
    timestamps: true,
});

const Conversation = mongoose.model("Conversation", conversationModel);
export default Conversation;
