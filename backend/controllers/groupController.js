import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// 1. Create a new group
export async function createGroup(req, res) {
    try {
        const creatorId = req.id;
        const { groupName, participants, groupPhoto } = req.body;

        if (!groupName || !groupName.trim()) {
            return res.status(400).json({ message: "Group name is required", success: false });
        }

        let memberIds = Array.isArray(participants) ? [...participants] : [];
        if (!memberIds.includes(creatorId)) {
            memberIds.push(creatorId);
        }

        if (memberIds.length < 2) {
            return res.status(400).json({ 
                message: "A group must have at least 2 members (including you)", 
                success: false 
            });
        }

        const defaultPhoto = `https://ui-avatars.com/api/?name=${encodeURIComponent(groupName.trim())}&background=00a884&color=fff&bold=true`;

        const newGroup = await Conversation.create({
            isGroup: true,
            groupName: groupName.trim(),
            groupAdmin: creatorId,
            groupPhoto: groupPhoto || defaultPhoto,
            participants: memberIds,
            messages: []
        });

        const populatedGroup = await Conversation.findById(newGroup._id)
            .populate("participants", "username fullName profilePhoto gender")
            .populate("groupAdmin", "username fullName profilePhoto");

        // Notify all online participants via socket that they have been added to a new group
        memberIds.forEach((memberId) => {
            const socketId = getReceiverSocketId(memberId.toString());
            if (socketId) {
                io.to(socketId).emit("newGroupCreated", populatedGroup);
            }
        });

        return res.status(201).json({
            message: "Group created successfully",
            success: true,
            group: populatedGroup
        });
    } catch (error) {
        console.error("Error creating group:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// 2. Get all groups for the logged-in user
export async function getMyGroups(req, res) {
    try {
        const userId = req.id;
        const groups = await Conversation.find({
            isGroup: true,
            participants: userId
        })
            .populate("participants", "username fullName profilePhoto gender")
            .populate("groupAdmin", "username fullName profilePhoto")
            .sort({ updatedAt: -1 });

        return res.status(200).json({ success: true, groups });
    } catch (error) {
        console.error("Error getting user groups:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// 3. Get group details (ensuring caller is a member)
export async function getGroupDetails(req, res) {
    try {
        const { groupId } = req.params;
        const userId = req.id;

        const group = await Conversation.findOne({
            _id: groupId,
            isGroup: true,
            participants: userId
        })
            .populate("participants", "username fullName profilePhoto gender")
            .populate("groupAdmin", "username fullName profilePhoto");

        if (!group) {
            return res.status(403).json({ message: "Access denied or group not found", success: false });
        }

        return res.status(200).json({ success: true, group });
    } catch (error) {
        console.error("Error getting group details:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// 4. Add member to group (admin only)
export async function addMember(req, res) {
    try {
        const { groupId } = req.params;
        const { userIdToAdd } = req.body;
        const requesterId = req.id;

        if (!userIdToAdd) {
            return res.status(400).json({ message: "User ID to add is required", success: false });
        }

        const group = await Conversation.findOne({ _id: groupId, isGroup: true });
        if (!group) {
            return res.status(404).json({ message: "Group not found", success: false });
        }

        // Only group admin can add members
        if (group.groupAdmin.toString() !== requesterId) {
            return res.status(403).json({ message: "Only the group admin can add members", success: false });
        }

        if (group.participants.includes(userIdToAdd)) {
            return res.status(400).json({ message: "User is already a member of this group", success: false });
        }

        group.participants.push(userIdToAdd);
        await group.save();

        const updatedGroup = await Conversation.findById(groupId)
            .populate("participants", "username fullName profilePhoto gender")
            .populate("groupAdmin", "username fullName profilePhoto");

        // Notify member added via socket
        const addedUserSocketId = getReceiverSocketId(userIdToAdd.toString());
        if (addedUserSocketId) {
            io.to(addedUserSocketId).emit("newGroupCreated", updatedGroup);
        }

        // Notify existing members
        updatedGroup.participants.forEach((p) => {
            const sid = getReceiverSocketId(p._id.toString());
            if (sid) {
                io.to(sid).emit("groupUpdated", updatedGroup);
            }
        });

        return res.status(200).json({
            message: "Member added successfully",
            success: true,
            group: updatedGroup
        });
    } catch (error) {
        console.error("Error adding member to group:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// 5. Remove member or leave group
export async function removeMember(req, res) {
    try {
        const { groupId } = req.params;
        const { userIdToRemove } = req.body;
        const requesterId = req.id;

        if (!userIdToRemove) {
            return res.status(400).json({ message: "User ID to remove is required", success: false });
        }

        const group = await Conversation.findOne({ _id: groupId, isGroup: true });
        if (!group) {
            return res.status(404).json({ message: "Group not found", success: false });
        }

        const isAdmin = group.groupAdmin.toString() === requesterId;
        const isSelf = requesterId === userIdToRemove;

        // Either admin is removing someone, or member is leaving on their own
        if (!isAdmin && !isSelf) {
            return res.status(403).json({ message: "You are not authorized to remove this member", success: false });
        }

        if (!group.participants.map(id => id.toString()).includes(userIdToRemove.toString())) {
            return res.status(400).json({ message: "User is not a member of this group", success: false });
        }

        // Remove participant
        group.participants = group.participants.filter(
            id => id.toString() !== userIdToRemove.toString()
        );

        // If admin left and there are still members, assign first remaining member as admin
        if (group.groupAdmin.toString() === userIdToRemove.toString() && group.participants.length > 0) {
            group.groupAdmin = group.participants[0];
        }

        await group.save();

        const updatedGroup = await Conversation.findById(groupId)
            .populate("participants", "username fullName profilePhoto gender")
            .populate("groupAdmin", "username fullName profilePhoto");

        // Notify removed member
        const removedSocketId = getReceiverSocketId(userIdToRemove.toString());
        if (removedSocketId) {
            io.to(removedSocketId).emit("groupRemoved", { groupId });
        }

        // Notify remaining members
        updatedGroup.participants.forEach((p) => {
            const sid = getReceiverSocketId(p._id.toString());
            if (sid) {
                io.to(sid).emit("groupUpdated", updatedGroup);
            }
        });

        return res.status(200).json({
            message: isSelf ? "Left group successfully" : "Member removed successfully",
            success: true,
            group: updatedGroup
        });
    } catch (error) {
        console.error("Error removing member from group:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// 6. Send group message
export async function sendGroupMessage(req, res) {
    try {
        const { groupId } = req.params;
        const senderId = req.id;
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ message: "Message content cannot be empty", success: false });
        }

        const group = await Conversation.findOne({
            _id: groupId,
            isGroup: true,
            participants: senderId
        });

        if (!group) {
            return res.status(403).json({ message: "Access denied. You are not a member of this group.", success: false });
        }

        const newMessage = await Message.create({
            senderId,
            conversationId: groupId,
            message: message.trim()
        });

        group.messages.push(newMessage._id);
        await group.save();

        const populatedMessage = await Message.findById(newMessage._id)
            .populate("senderId", "username fullName profilePhoto");

        // Broadcast to all other online members of the group
        group.participants.forEach((memberId) => {
            if (memberId.toString() !== senderId.toString()) {
                const socketId = getReceiverSocketId(memberId.toString());
                if (socketId) {
                    io.to(socketId).emit("newGroupMessage", {
                        groupId,
                        message: populatedMessage
                    });
                }
            }
        });

        return res.status(201).json({
            success: true,
            newMessage: populatedMessage
        });
    } catch (error) {
        console.error("Error sending group message:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// 7. Get group messages (strictly for group members only)
export async function getGroupMessages(req, res) {
    try {
        const { groupId } = req.params;
        const userId = req.id;

        const group = await Conversation.findOne({
            _id: groupId,
            isGroup: true,
            participants: userId
        }).populate({
            path: "messages",
            populate: {
                path: "senderId",
                select: "username fullName profilePhoto"
            }
        });

        if (!group) {
            return res.status(403).json({ message: "Access denied. You are not a member of this group.", success: false });
        }

        return res.status(200).json({
            success: true,
            messages: group.messages || []
        });
    } catch (error) {
        console.error("Error fetching group messages:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

