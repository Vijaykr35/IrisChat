import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';

function OtherUser({ user, darkMode }) {
    const dispatch = useDispatch();

    const { selectedUser, onlineUsers } = useSelector((store) => store.user);

    const isOnline = onlineUsers?.some(
        (onlineUser) => onlineUser === user._id
    );
    

    const handleSelectUser = () => {
        dispatch(setSelectedUser(user));
    };

    return (
        <div
            onClick={handleSelectUser}
            className={`flex items-center gap-3 p-3 cursor-pointer border-b overflow-hidden
                ${darkMode ? 'border-[#313d45]' : 'border-[#f0f2f5]'}
                ${selectedUser?._id === user._id 
                    ? (darkMode ? 'bg-[#2a3942]' : 'bg-[#f0f2f5]') 
                    : ''}
                ${darkMode ? 'hover:bg-[#202c33] text-[#e9edef]' : 'hover:bg-[#f0f2f5] text-[#111b21]'}`}
        >
            <div className="relative">
                <img
                    src={user.profilePhoto || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
                />
                {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full" />
                )}
            </div>
            <div className="flex-1">
                <h3 className="font-medium">{user.username}</h3>
            </div>
        </div>
    );
}

export default OtherUser;
