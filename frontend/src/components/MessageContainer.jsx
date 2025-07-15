import React, { useEffect } from 'react';
import SendMessage from './sendMessage.jsx';
import Messages from './Mesages.jsx';
import { useSelector, useDispatch } from "react-redux";
import { setSelectedUser } from '../redux/userSlice';

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
                <h1 className='text-2xl text-white'>Let's start a conversation</h1>
            </div>
        );
    }

    return (
        <div className='md:min-w-[550px] flex flex-col'>
            {/* Header */}
            <div className='flex gap-2 items-center bg-zinc-800 text-white px-4 py-2 mb-2'>
                <div>
                    <div className='w-12 rounded-full'>
                        {selectedUser && <img src={selectedUser?.profilePhoto} alt="user-profile" />}
                    </div>
                </div>
                <div className='flex flex-col flex-1'>
                    <div className='flex justify-between gap-2'>
                        <p>{selectedUser?.fullName} </p>
                    </div>
                </div>
            </div>

            {/* Messages Section */}
            <Messages darkMode={true} />

            {/* Send Message Input */}
            <SendMessage />
        </div>
    );
}

export default MessageContainer;
