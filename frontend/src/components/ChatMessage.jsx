/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */

import { useSelector } from 'react-redux';

export default function ChatMessage({ message, darkMode }) {
    if (!message) return null;

    const selectedUser = useSelector((store) => store.user.selectedUser);
    const authUser = useSelector((store) => store.user.authUser);
    const isSelf = message?.senderId === authUser?._id;

    const timeString = new Date(message.createdAt || Date.now()).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    return (
        <div className={`chat ${isSelf ? 'chat-end' : 'chat-start'} animate-message my-0.5 sm:my-1`}>
            <div
                className={`chat-bubble py-2 px-3 sm:py-2.5 sm:px-3.5 text-[14px] sm:text-[15px] leading-relaxed shadow-sm break-words max-w-[85%] sm:max-w-md md:max-w-lg whitespace-pre-wrap transition-all select-text ${
                    isSelf
                        ? (darkMode ? 'bg-[#005c4b] text-[#e9edef] rounded-2xl rounded-tr-none' : 'bg-[#d9fdd3] text-[#111b21] rounded-2xl rounded-tr-none')
                        : (darkMode ? 'bg-[#202c33] text-[#e9edef] rounded-2xl rounded-tl-none' : 'bg-[#ffffff] text-[#111b21] rounded-2xl rounded-tl-none')
                }`}
            >
                <div className="break-words">
                    {message?.message}
                </div>

                {/* Compact bottom-right timestamp (WhatsApp style) */}
                <div
                    className={`text-[10px] mt-1 -mb-0.5 flex items-center justify-end gap-1 opacity-70 select-none ${
                        isSelf ? (darkMode ? 'text-[#aebac1]' : 'text-[#54656f]') : 'text-[#8696a0]'
                    }`}
                >
                    <span>{timeString}</span>
                </div>
            </div>
        </div>
    );
}
