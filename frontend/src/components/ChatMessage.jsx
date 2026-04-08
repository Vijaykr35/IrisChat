/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */

import { useSelector } from 'react-redux';
// eslint-disable-next-line react/prop-types
export default function ChatMessage({ message, darkMode }) {
    if (!message) return (<div> start a conversation </div>);


    // eslint-disable-next-line react-hooks/rules-of-hooks
    const selectedUser = useSelector((store) => store.user.selectedUser);
    const authUser = useSelector((store) => store.user.authUser);

    return (

        <div className={`chat ${message?.senderId === authUser?._id ? 'chat-end' : 'chat-start'}`}>
            <div className="chat-header mb-1 opacity-70">
                <span className='font-medium text-sm'>{message?.senderId === authUser?._id ? "You" : selectedUser?.username}</span>
                <time className="text-xs ml-2 opacity-50">
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                </time>
            </div>
            <div className={`chat-bubble py-2 px-3 text-[15px] leading-snug shadow-sm break-words max-w-lg whitespace-pre-wrap ${
                message?.senderId === authUser?._id 
                ? (darkMode ? 'bg-[#005c4b] text-[#e9edef] rounded-md rounded-tr-none' : 'bg-[#d9fdd3] text-[#111b21] rounded-md rounded-tr-none') 
                : (darkMode ? 'bg-[#202c33] text-[#e9edef] rounded-md rounded-tl-none' : 'bg-[#ffffff] text-[#111b21] rounded-md rounded-tl-none')
                }`}>
                {message?.message}
            </div>
        </div>
    )
}
