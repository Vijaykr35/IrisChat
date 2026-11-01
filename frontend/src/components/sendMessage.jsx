import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setMessages } from '../redux/messageSlice';
import EmojiPicker from 'emoji-picker-react';
import { CiFaceSmile } from "react-icons/ci";
import { IoMdSend } from "react-icons/io";
import { FiMaximize2 } from "react-icons/fi";

function SendMessage({ darkMode }) {
    const [message, setMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [chatbarHeight, setChatbarHeight] = useState(() => {
        const saved = localStorage.getItem("irischat_chatbar_height") || localStorage.getItem("chaatter_chatbar_height");
        return saved ? Math.max(60, Math.min(220, parseInt(saved, 10))) : 60;
    });
    const [isResizing, setIsResizing] = useState(false);

    const dispatch = useDispatch();
    const selectedUser = useSelector(store => store.user.selectedUser);
    const authUser = useSelector(store => store.user.authUser);
    const messages = useSelector(store => store.message.messages) || [];

    // Vertical drag-to-resize chatbar height (Desktop only)
    const startResizing = (e) => {
        e.preventDefault();
        setIsResizing(true);
    };

    useEffect(() => {
        if (!isResizing) return;
        const handleMouseMove = (e) => {
            const newHeight = Math.max(60, Math.min(240, window.innerHeight - e.clientY));
            setChatbarHeight(newHeight);
            localStorage.setItem("irischat_chatbar_height", newHeight.toString());
        };
        const handleMouseUp = () => setIsResizing(false);

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizing]);

    const onEmojiClick = (emojiData) => {
        setMessage(prev => prev + emojiData.emoji);
    };

    const onSubmitHandler = async (e) => {
        if (e) e.preventDefault();
        const trimmed = message.trim();
        if (!trimmed || !selectedUser?._id) return;

        setMessage('');
        setShowEmojiPicker(false);

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/message/send/${selectedUser._id}`,
                { message: trimmed },
                { headers: { "Content-Type": "application/json" }, withCredentials: true }
            );

            if (res?.data?.newMessage) {
                dispatch(setMessages([...messages, res.data.newMessage]));
            }
        } catch (err) {
            console.error(`Error sending message: ${err}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmitHandler();
        }
    };

    if (!selectedUser) return null;

    return (
        <div
            className={`w-full px-2 sm:px-4 py-1.5 sm:py-2 flex items-center relative border-t transition-colors duration-200 z-20 flex-shrink-0 ${
                darkMode ? 'bg-[#202c33] border-[#313d45]' : 'bg-[#f0f2f5] border-[#d1d7db]'
            }`}
            style={{ minHeight: '56px' }}
        >
            {/* Top Resize Drag Handle (Desktop only) */}
            <div
                onMouseDown={startResizing}
                className="hidden sm:flex absolute -top-2 left-0 right-0 h-4 cursor-row-resize items-center justify-center group z-30 select-none"
                title="Drag up or down to resize chatbar shape & height"
            >
                <div className={`w-14 h-1 rounded-full transition-all ${
                    isResizing ? 'bg-[#00a884] h-1.5' : 'bg-transparent group-hover:bg-[#00a884]/70'
                }`} />
            </div>

            {/* Emoji Picker Popup with mobile bounds constraint */}
            {showEmojiPicker && (
                <div className="absolute bottom-full mb-2 left-1 right-1 sm:left-4 sm:right-auto z-40 shadow-2xl flex justify-center">
                    <div className="max-w-[calc(100vw-1rem)] sm:max-w-none">
                        <EmojiPicker
                            theme={darkMode ? "dark" : "light"}
                            onEmojiClick={onEmojiClick}
                            width={window.innerWidth < 450 ? 310 : 360}
                            height={340}
                        />
                    </div>
                </div>
            )}

            <form onSubmit={onSubmitHandler} className="flex-1 flex items-center gap-1.5 sm:gap-3 h-full">
                {/* Emoji button with touch area */}
                <button
                    type="button"
                    className={`p-2 rounded-full transition-colors flex-shrink-0 active:scale-95 ${
                        darkMode ? 'text-[#8696a0] hover:bg-[#374248]' : 'text-[#54656f] hover:bg-[#e9edef]'
                    }`}
                    onClick={() => setShowEmojiPicker(prev => !prev)}
                    title="Insert Emoji"
                    aria-label="Insert Emoji"
                >
                    <CiFaceSmile size={24} className="sm:text-[26px]" />
                </button>

                {/* Auto-growing / compact textarea with iOS zoom prevention (text-base on mobile, text-sm on desktop) */}
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    rows={1}
                    className={`flex-1 py-2 px-3 sm:py-2.5 sm:px-4 rounded-2xl border-none resize-none focus:outline-none focus:ring-1 focus:ring-[#00a884] transition-all text-base sm:text-sm leading-normal max-h-32 ${
                        darkMode ? 'bg-[#2a3942] text-[#d1d7db] placeholder-[#8696a0]' : 'bg-[#ffffff] text-[#111b21] placeholder-[#667781]'
                    }`}
                />

                <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                        type="button"
                        onClick={() => {
                            const next = chatbarHeight > 90 ? 60 : 130;
                            setChatbarHeight(next);
                            localStorage.setItem("irischat_chatbar_height", next.toString());
                        }}
                        className={`p-2 rounded-full transition-colors hidden sm:flex ${
                            darkMode ? 'text-[#8696a0] hover:bg-[#374248]' : 'text-[#54656f] hover:bg-[#e9edef]'
                        }`}
                        title={chatbarHeight > 90 ? "Compact Chatbar" : "Expand Chatbar"}
                    >
                        <FiMaximize2 size={16} />
                    </button>

                    {/* Touch-optimized Send button */}
                    <button
                        type="submit"
                        disabled={!message.trim()}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all bg-[#00a884] text-white shadow-md active:scale-95 disabled:opacity-40 disabled:bg-transparent disabled:text-[#8696a0] disabled:shadow-none"
                        title="Send Message"
                        aria-label="Send Message"
                    >
                        <IoMdSend className="w-5 h-5 ml-0.5" />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SendMessage;
