import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../redux/messageSlice";

export default function useGetRealTimeMessage() {
  const socket = useSelector(state => state.socket.socket);
  const messages = useSelector(state => state.message.messages);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      dispatch(setMessages([...messages, newMessage])); // ✅ FIX
    };

    socket.on("newMessage", handleNewMessage);

    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, messages, dispatch]); // ✅ add messages dependency
}
