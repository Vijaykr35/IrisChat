import { useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setMessages } from '../redux/messageSlice';

function useGetMessage() {
    const { selectedUser } = useSelector(store => store.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!selectedUser?._id) {
            dispatch(setMessages([]));
            return;
        }

        // Immediately clear previous conversation to prevent stale messages from showing
        dispatch(setMessages([]));

        const fetchMessages = async () => {
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/message/${selectedUser._id}`);
                dispatch(setMessages(res.data.messages || []));
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
    }, [selectedUser?._id, dispatch]);
}

export default useGetMessage;
