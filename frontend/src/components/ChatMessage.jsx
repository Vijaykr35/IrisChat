import React from 'react'
import { useSelector } from 'react-redux';
export default function ChatMessage({ message }) {
    if (!message) return (<div> start a conversation </div>);
    const selectedUser = useSelector((store) => store.user.selectedUser);
    const authUser = useSelector((store) => store.user.authUser);

    return (

        <div ref={scroll} className={`chat ${message?.senderId === authUser?._id ? 'chat-end' : 'chat-start'}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img alt="Tailwind CSS chat bubble component" src={message?.senderId === authUser?._id ? authUser?.profilePhoto : selectedUser?.profilePhoto} />
                </div>
            </div>
            <div className="chat-header">
                <time className="text-xs opacity-50 text-gray-500">
                    {new Date(message.createdAt).toLocaleDateString()} ,{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                </time>
            </div>
            <div className={`chat-bubble p-4 ${message?.senderId !== authUser?._id ? 'bg-gray-200 text-black' : 'text-gray-300'} `}>{message?.message}</div>
        </div>
    )
}
