/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */

import { useSelector } from 'react-redux';
// eslint-disable-next-line react/prop-types
export default function ChatMessage({ message }) {
    if (!message) return (<div> start a conversation </div>);


    // eslint-disable-next-line react-hooks/rules-of-hooks
    const selectedUser = useSelector((store) => store.user.selectedUser);
    const authUser = useSelector((store) => store.user.authUser);

    return (

        <div className={`chat ${message?.senderId === authUser?._id ? 'chat-end' : 'chat-start'}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img alt="Tailwind CSS chat bubble component" src={message?.senderId === authUser?._id ? authUser?.profilePhoto : selectedUser?.profilePhoto} />
                </div>
            </div>
            <div className="chat-header mb-1 opacity-70">
                <span className='font-medium text-sm'>{message?.senderId === authUser?._id ? "You" : selectedUser?.fullName}</span>
                <time className="text-xs ml-2 opacity-50">
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                </time>
            </div>
            <div className={`chat-bubble p-4 text-sm shadow-md transition-all ${message?.senderId !== authUser?._id ? 'bg-white text-slate-800 rounded-2xl rounded-tl-sm' : 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm'} `}>{message?.message}</div>
        </div>
    )
}
