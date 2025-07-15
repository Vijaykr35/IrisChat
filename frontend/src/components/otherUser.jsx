import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';

function OtherUser({ user, darkMode }) {
    const dispatch = useDispatch();

    const { selectedUser, onlineUsers } = useSelector((store) => store.user);

    const isOnline = onlineUsers?.some(
        (onlineUser) => onlineUser === user._id
    );
    console.log("online user is ", isOnline);

    const handleSelectUser = () => {
        dispatch(setSelectedUser(user));
    };

    return (
        <div
            onClick={handleSelectUser}
            className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer border-b border-b-slate-600
                ${selectedUser?._id === user._id ? 'bg-gray-500' : ''}
                ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-500'}`}
        >
            <div className="relative">
                <img
                    src={user.profilePhoto}
                    alt="avatar"
                    className="w-12 h-12 rounded-full"
                />
                {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full" />
                )}
            </div>
            <div className="flex-1">
                <h3 className="font-medium">{user.fullName}</h3>
            </div>
        </div>
    );
}

export default OtherUser;
