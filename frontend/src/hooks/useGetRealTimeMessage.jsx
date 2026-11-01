import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../redux/messageSlice";
import {
  addGroupMessage,
  setGroups,
  updateGroupInList,
  removeGroupFromList
} from "../redux/groupSlice";

export default function useGetRealTimeMessage() {
  const socket = useSelector(state => state.socket.socket);
  const messages = useSelector(state => state.message.messages);
  const selectedUser = useSelector(state => state.user.selectedUser);
  const selectedGroup = useSelector(state => state.group.selectedGroup);
  const groups = useSelector(state => state.group.groups);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    // 1-to-1 message handler
    const handleNewMessage = (newMessage) => {
      if (!newMessage) return;
      // Never append group messages to 1-to-1 conversation
      if (newMessage.conversationId) return;

      const senderId = newMessage.senderId?._id || newMessage.senderId;
      const receiverId = newMessage.receiverId?._id || newMessage.receiverId;

      // Only append if it belongs to the currently opened 1-to-1 chat
      if (selectedUser?._id && (senderId === selectedUser._id || receiverId === selectedUser._id)) {
        dispatch(setMessages([...messages, newMessage]));
      }
    };

    // Group real-time message handler
    const handleNewGroupMessage = (data) => {
      if (data && data.message && data.groupId) {
        if (selectedGroup?._id === data.groupId) {
          dispatch(addGroupMessage(data.message));
        }
      }
    };

    const handleNewGroupCreated = (newGroup) => {
      if (newGroup) {
        dispatch(setGroups([newGroup, ...groups]));
      }
    };

    const handleGroupUpdated = (updatedGroup) => {
      if (updatedGroup) {
        dispatch(updateGroupInList(updatedGroup));
      }
    };

    const handleGroupRemoved = ({ groupId }) => {
      if (groupId) {
        dispatch(removeGroupFromList(groupId));
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("newGroupMessage", handleNewGroupMessage);
    socket.on("newGroupCreated", handleNewGroupCreated);
    socket.on("groupUpdated", handleGroupUpdated);
    socket.on("groupRemoved", handleGroupRemoved);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("newGroupMessage", handleNewGroupMessage);
      socket.off("newGroupCreated", handleNewGroupCreated);
      socket.off("groupUpdated", handleGroupUpdated);
      socket.off("groupRemoved", handleGroupRemoved);
    };
  }, [socket, messages, selectedUser, selectedGroup, groups, dispatch]);
}
