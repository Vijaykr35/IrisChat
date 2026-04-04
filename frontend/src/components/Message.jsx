import { useEffect, useRef } from 'react';
import ChatHeader from './chatHeader.jsx';
import SendMessage from './sendMessage.jsx';
import { useSelector } from 'react-redux';
import useGetMessage from '../hooks/useGetMessage.jsx';
import ChatMessage from './ChatMessage.jsx';
import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage.jsx';

function Message({ darkMode }) {
    useGetMessage();
    useGetRealTimeMessage();

    // const { selectedUser } = useSelector(store => store.user);
    // const authUser = useSelector(store => store.user.authUser);
    const messages = useSelector(store => store.message.messages) || [];

    const messageEndRef = useRef(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 w-full flex flex-col min-h-0 relative">
            <ChatHeader darkMode={darkMode} />

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-24">
                {messages?.length > 0 && 
                    messages.map((message) => (
                        <ChatMessage key={message._id} message={message} darkMode={darkMode} />
                    ))
                }

                {/* Dummy div to scroll into view */}
                <div ref={messageEndRef} />
            </div>

            {/* Input field firmly anchored to the boundary of Message flex column */}
            <SendMessage darkMode={darkMode} />
        </div>
    );
}

export default Message;
