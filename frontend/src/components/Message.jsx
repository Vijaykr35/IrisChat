import { useEffect, useRef } from 'react';
import ChatHeader from './chatHeader.jsx';
import { useSelector } from 'react-redux';
import useGetMessage from '../hooks/useGetMessage.jsx';
import ChatMessage from './ChatMessage.jsx';
// import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage.jsx';

function Message() {
    useGetMessage();
    // useGetRealTimeMessage();

    // const { selectedUser } = useSelector(store => store.user);
    // const authUser = useSelector(store => store.user.authUser);
    const messages = useSelector(store => store.message.messages) || { messages: [] };

    const messageEndRef = useRef(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.messages]);

    return (
        <div className="h-[calc(100vh-100px)] overflow-y-auto p-4">
            <ChatHeader className="mb-4 fixed" darkMode={true} />

            {messages?.messages?.length > 0 && 
                messages.messages.map((message) => (
                    <ChatMessage key={message._id} message={message} />
                ))
            }

            {/* Dummy div to scroll into view */}
            <div ref={messageEndRef} />
        </div>
    );
}

export default Message;
