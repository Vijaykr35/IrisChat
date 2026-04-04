import  { useEffect } from 'react';
import SendMessage from './sendMessage.jsx';
import Messages from './Message.jsx';
import { useSelector, useDispatch } from "react-redux";
import { setSelectedUser } from '../redux/userSlice';
import ChatHeader from './chatHeader.jsx';

const MessageContainer = () => {
    const { selectedUser, authUser } = useSelector(store => store.user);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null)); // ✅ Reset selected user on unmount
        };
    }, [selectedUser, dispatch]);

    if (!selectedUser) {
        return (
            <div className='md:min-w-[550px] flex flex-col justify-center items-center'>
                <h1 className='text-4xl text-white font-bold'>Hi, {authUser?.fullName}</h1>
                <h1 className='text-2xl text-white'>Let&apos;s start a conversation</h1>
            </div>
        );
    }

    return (
        <div className='md:min-w-[550px] flex flex-col h-full'>
            {/* Header Fixed Outside Scroll */}
            <ChatHeader />

            {/* Messages Section */}
            <Messages darkMode={true} />

            {/* Send Message Input */}
            <SendMessage />
        </div>
    );
}

export default MessageContainer;
