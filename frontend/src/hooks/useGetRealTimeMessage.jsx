import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../redux/messageSlice";

export default function useGetRealTimeMessage() {
    const socket = useSelector(state => state.socket.socket);
    const messages = useSelector(state => state.messages.messages); // Check reducer name!
    const dispatch = useDispatch();

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            dispatch(setMessages(prev => {
                const updated = prev ? [...prev, newMessage] : [newMessage];
                return updated;
            }));
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [socket, dispatch]);
}
