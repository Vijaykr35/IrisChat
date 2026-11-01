import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';

function OtherUser({ user, darkMode, searchQuery = "" }) {
    const dispatch = useDispatch();
    const { selectedUser, onlineUsers } = useSelector((store) => store.user);

    const isOnline = onlineUsers?.some(
        (onlineUser) => onlineUser === user._id
    );

    const handleSelectUser = () => {
        dispatch(setSelectedUser(user));
    };

    // Safely render highlighted search match wrapped in concrete span elements (Chrome reconcile safe)
    const renderHighlightedText = (text) => {
        if (!text) return null;
        if (!searchQuery) return <span>{text}</span>;
        const q = searchQuery.toLowerCase();
        const idx = text.toLowerCase().indexOf(q);
        if (idx === -1) return <span>{text}</span>;

        const before = text.slice(0, idx);
        const match = text.slice(idx, idx + q.length);
        const after = text.slice(idx + q.length);

        return (
            <span>
                {before ? <span>{before}</span> : null}
                <span className="text-[#00a884] font-semibold bg-[#00a884]/15 px-0.5 rounded">
                    {match}
                </span>
                {after ? <span>{after}</span> : null}
            </span>
        );
    };

    const displayName = user.fullName || user.username;

    return (
        <div
            onClick={handleSelectUser}
            className={`flex items-center gap-3 p-3 cursor-pointer border-b transition-colors select-none ${
                darkMode ? 'border-[#313d45]' : 'border-[#f0f2f5]'
            } ${
                selectedUser?._id === user._id
                    ? (darkMode ? 'bg-[#2a3942]' : 'bg-[#e9edef]')
                    : (darkMode ? 'hover:bg-[#202c33] text-[#e9edef]' : 'hover:bg-[#f5f6f6] text-[#111b21]')
            }`}
        >
            <div className="relative flex-shrink-0">
                <img
                    src={user.profilePhoto || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt={user.username || "avatar"}
                    className="w-11 h-11 rounded-full object-cover"
                    onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; }}
                />
                {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111b21]" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">
                    {renderHighlightedText(displayName)}
                </h3>
                {user.fullName && user.fullName !== user.username ? (
                    <p className={`text-xs truncate ${darkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>
                        <span>@</span>{renderHighlightedText(user.username)}
                    </p>
                ) : null}
            </div>
        </div>
    );
}

export default OtherUser;
