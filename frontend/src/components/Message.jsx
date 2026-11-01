import { useEffect, useRef } from 'react';
import ChatHeader from './chatHeader.jsx';
import SendMessage from './sendMessage.jsx';
import { useSelector } from 'react-redux';
import useGetMessage from '../hooks/useGetMessage.jsx';
import ChatMessage from './ChatMessage.jsx';
import { BsChatDotsFill } from "react-icons/bs";

function Message({ darkMode }) {
    useGetMessage();

    const selectedUser = useSelector(store => store.user.selectedUser);
    const authUser = useSelector(store => store.user.authUser);
    const messages = useSelector(store => store.message.messages) || [];
    const messageEndRef = useRef(null);

    // Smooth scroll to bottom when messages change
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!selectedUser) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 text-center select-none">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#00a884]/20 flex items-center justify-center text-[#00a884] mb-4 shadow-lg">
                    <BsChatDotsFill size={28} className="sm:text-[32px]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Hi, {authUser?.fullName || authUser?.username} 👋</h2>
                <p className={`max-w-md text-xs sm:text-sm ${darkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>
                    Select a contact from the list to start a conversation.
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 w-full flex flex-col min-h-0 relative h-full">
            <ChatHeader darkMode={darkMode} />

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-4 pb-4 space-y-2 sm:space-y-3 scroll-smooth touch-pan-y">
                {messages?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center select-none">
                        <div className="w-12 h-12 rounded-full bg-[#00a884]/10 flex items-center justify-center text-[#00a884] mb-3">
                            <BsChatDotsFill size={22} />
                        </div>
                        <p className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>
                            No messages yet. Say hello to {selectedUser.fullName || selectedUser.username}! 👋
                        </p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <ChatMessage key={message._id || Math.random()} message={message} darkMode={darkMode} />
                    ))
                )}

                {/* Anchor div to scroll smoothly into view */}
                <div ref={messageEndRef} />
            </div>

            {/* Chatbar input */}
            <SendMessage darkMode={darkMode} />
        </div>
    );
}

export default Message;
