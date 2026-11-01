import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setGroupMessages, addGroupMessage } from '../../redux/groupSlice';
import GroupChatHeader from './GroupChatHeader';
import EmojiPicker from 'emoji-picker-react';
import { CiFaceSmile } from "react-icons/ci";
import { IoMdSend } from "react-icons/io";
import { FiUsers, FiMaximize2 } from 'react-icons/fi';

export default function GroupChatView({ darkMode }) {
    const dispatch = useDispatch();
    const { selectedGroup, groupMessages } = useSelector((store) => store.group);
    const authUser = useSelector((store) => store.user.authUser);

    const [messageText, setMessageText] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [chatbarHeight, setChatbarHeight] = useState(() => {
        const saved = localStorage.getItem("chaatter_chatbar_height");
        return saved ? Math.max(64, Math.min(220, parseInt(saved, 10))) : 64;
    });
    const [isResizing, setIsResizing] = useState(false);
    const messageEndRef = useRef(null);

    // Vertical drag-to-resize chatbar height
    const startResizing = (e) => {
        e.preventDefault();
        setIsResizing(true);
    };

    useEffect(() => {
        if (!isResizing) return;
        const handleMouseMove = (e) => {
            const newHeight = Math.max(64, Math.min(240, window.innerHeight - e.clientY));
            setChatbarHeight(newHeight);
            localStorage.setItem("chaatter_chatbar_height", newHeight.toString());
        };
        const handleMouseUp = () => setIsResizing(false);

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizing]);

    // Fetch messages when selected group changes
    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedGroup?._id) return;
            try {
                setLoading(true);
                const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api/v1";
                const res = await axios.get(
                    `${backendUrl}/group/${selectedGroup._id}/messages`,
                    { withCredentials: true }
                );
                if (res.data.success) {
                    dispatch(setGroupMessages(res.data.messages));
                }
            } catch (error) {
                console.error("Error fetching group messages:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [selectedGroup?._id, dispatch]);

    // Scroll smoothly to bottom on message updates
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [groupMessages]);

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        const trimmed = messageText.trim();
        if (!trimmed || !selectedGroup?._id) return;

        setMessageText("");
        setShowEmojiPicker(false);

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api/v1";
            const res = await axios.post(
                `${backendUrl}/group/${selectedGroup._id}/message`,
                { message: trimmed },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );

            if (res.data.success) {
                dispatch(addGroupMessage(res.data.newMessage));
            }
        } catch (error) {
            console.error("Error sending group message:", error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!selectedGroup) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none">
                <div className="w-16 h-16 rounded-2xl bg-[#00a884]/20 flex items-center justify-center text-[#00a884] mb-4 shadow-lg">
                    <FiUsers size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Group Chats</h2>
                <p className={`max-w-md text-sm ${darkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>
                    Select an existing group from the list or create a new group to start messaging your team or friends.
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 w-full flex flex-col min-h-0 relative">
            <GroupChatHeader darkMode={darkMode} />

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-4 pb-6 space-y-3 scroll-smooth">
                {loading && groupMessages.length === 0 ? (
                    <div className="text-center py-8 text-xs text-gray-500">Loading messages...</div>
                ) : groupMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center select-none">
                        <div className="w-12 h-12 rounded-full bg-[#00a884]/10 flex items-center justify-center text-[#00a884] mb-3">
                            <FiUsers size={22} />
                        </div>
                        <p className={`text-sm ${darkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>
                            No messages in this group yet. Say hello! 👋
                        </p>
                    </div>
                ) : (
                    groupMessages.map((msg) => {
                        const senderId = msg.senderId?._id || msg.senderId;
                        const isSelf = senderId === authUser?._id;
                        const senderName = isSelf ? "You" : (msg.senderId?.fullName || msg.senderId?.username || "Member");
                        const senderPhoto = msg.senderId?.profilePhoto || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

                        return (
                            <div key={msg._id || Math.random()} className={`chat ${isSelf ? 'chat-end' : 'chat-start'} animate-message`}>
                                {!isSelf && (
                                    <div className="chat-image avatar">
                                        <div className="w-8 rounded-full">
                                            <img
                                                src={senderPhoto}
                                                alt={senderName}
                                                onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="chat-header mb-1 opacity-75">
                                    <span className="font-semibold text-xs text-[#00a884]">{senderName}</span>
                                    <time className="text-[10px] ml-2 opacity-60">
                                        {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                    </time>
                                </div>

                                <div
                                    className={`chat-bubble py-2 px-3 text-[15px] leading-snug shadow-sm break-words max-w-lg whitespace-pre-wrap transition-all ${
                                        isSelf
                                            ? (darkMode ? 'bg-[#005c4b] text-[#e9edef] rounded-md rounded-tr-none' : 'bg-[#d9fdd3] text-[#111b21] rounded-md rounded-tr-none')
                                            : (darkMode ? 'bg-[#202c33] text-[#e9edef] rounded-md rounded-tl-none' : 'bg-[#ffffff] text-[#111b21] rounded-md rounded-tl-none')
                                    }`}
                                >
                                    {msg.message}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messageEndRef} />
            </div>

            {/* Resizable Input Bar */}
            <div
                style={{ height: `${chatbarHeight}px` }}
                className={`w-full px-4 flex items-center relative border-t transition-colors duration-200 z-20 flex-shrink-0 ${
                    darkMode ? 'bg-[#202c33] border-[#313d45]' : 'bg-[#f0f2f5] border-[#d1d7db]'
                }`}
            >
                {/* Top Resize Drag Handle */}
                <div
                    onMouseDown={startResizing}
                    className="absolute -top-2 left-0 right-0 h-4 cursor-row-resize flex items-center justify-center group z-30 select-none"
                    title="Drag up or down to resize chatbar shape & height"
                >
                    <div className={`w-14 h-1 rounded-full transition-all ${
                        isResizing ? 'bg-[#00a884] h-1.5' : 'bg-transparent group-hover:bg-[#00a884]/70'
                    }`} />
                </div>

                {showEmojiPicker && (
                    <div className="absolute bottom-full mb-2 left-4 z-40 shadow-2xl">
                        <EmojiPicker
                            theme={darkMode ? "dark" : "light"}
                            onEmojiClick={(data) => setMessageText(prev => prev + data.emoji)}
                        />
                    </div>
                )}

                <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-3 h-full py-2">
                    <button
                        type="button"
                        onClick={() => setShowEmojiPicker(prev => !prev)}
                        className={`p-2 rounded-full transition-colors flex-shrink-0 ${
                            darkMode ? 'text-[#8696a0] hover:bg-[#374248]' : 'text-[#54656f] hover:bg-[#e9edef]'
                        }`}
                        title="Insert Emoji"
                    >
                        <CiFaceSmile size={26} />
                    </button>

                    <textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={`Message ${selectedGroup.groupName}... (Enter to send, Shift+Enter for new line)`}
                        className={`flex-1 p-2.5 px-4 rounded-xl border-none resize-none focus:outline-none focus:ring-1 focus:ring-[#00a884] transition-all text-sm leading-relaxed ${
                            darkMode ? 'bg-[#2a3942] text-[#d1d7db] placeholder-[#8696a0]' : 'bg-[#ffffff] text-[#111b21] placeholder-[#667781]'
                        }`}
                        style={{ height: `${Math.max(42, chatbarHeight - 20)}px` }}
                    />

                    <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                            type="button"
                            onClick={() => {
                                const next = chatbarHeight > 100 ? 64 : 140;
                                setChatbarHeight(next);
                                localStorage.setItem("chaatter_chatbar_height", next.toString());
                            }}
                            className={`p-2 rounded-full transition-colors hidden sm:flex ${
                                darkMode ? 'text-[#8696a0] hover:bg-[#374248]' : 'text-[#54656f] hover:bg-[#e9edef]'
                            }`}
                            title={chatbarHeight > 100 ? "Compact Chatbar" : "Expand Chatbar"}
                        >
                            <FiMaximize2 size={16} />
                        </button>

                        <button
                            type="submit"
                            disabled={!messageText.trim()}
                            className={`p-2 rounded-full transition-all text-[#00a884] hover:bg-[#00a884]/10 disabled:opacity-30 disabled:hover:bg-transparent`}
                            title="Send Message"
                        >
                            <IoMdSend className="w-6 h-6" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
