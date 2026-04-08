import { useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setMessages } from '../redux/messageSlice';

function useGetMessage() {
    const { selectedUser } = useSelector(store => store.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedUser?._id) return; // ✅ Prevents unnecessary API calls

            try {
                axios.defaults.withCredentials = true;
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/message/${selectedUser._id}`);
                
                dispatch(setMessages(res.data.messages));
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
    }, [selectedUser?._id, dispatch]); // ✅ Removed `setMessages` from dependencies
}

export default useGetMessage;
