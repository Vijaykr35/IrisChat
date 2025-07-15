import { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setMessages } from '../redux/messageSlice';
import EmojiPicker from 'emoji-picker-react';
import { CiFaceSmile } from "react-icons/ci";
import { IoMdSend } from "react-icons/io";


function SendMessage({ darkMode }) {
    const [message, setMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const dispatch = useDispatch();
    const selectedUser = useSelector(store => store.user.selectedUser);
    const authUser = useSelector(store => store.user.authUser);
    const messages = useSelector(store => store.message?.messages?.messages || []);

    const onEmojiClick = (emojiData) => {
        setMessage(prev => prev + emojiData.emoji);
    };


    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!selectedUser?._id) return;

        try {
            const res = await axios.post(
                `http://localhost:8080/api/v1/message/send/${selectedUser._id}`,
                { message },
                { headers: { "Content-Type": "application/json" }, withCredentials: true }
            );

            dispatch(setMessages({
                messages: [...messages, res?.data?.newMessage]
            }));
            setMessage('');
        } catch (err) {
            console.log(`Error: ${err}`);
        }
    };

    return (
        <div className={`fixed bottom-0 right-0 w-[75%] p-4 border-t shadow-md bg-opacity-0 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-200 border-gray-300'}`}>
            {showEmojiPicker && (
                <div className="absolute bottom-16">
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
            )}
            {selectedUser && (
                <form onSubmit={onSubmitHandler} className="flex items-center gap-3">
                    <button type="button" onClick={() => setShowEmojiPicker(prev => !prev)}>
                        <CiFaceSmile size={24} />
                    </button>

                    <input
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        type="text"
                        placeholder="Type a message..."
                        className={`flex-1 p-3 rounded-full border focus:outline-none focus:ring-2 ${darkMode ? 'bg-gray-800 text-gray-200 border-gray-700 focus:ring-teal-500' : 'bg-gray-100 text-gray-900 border-gray-400 focus:ring-blue-500'}`}
                    />

                    <button
                        type="submit"
                        className={`px-4 py-2 rounded-full opacity-100 hover:opacity-50`}

                    >

                        <IoMdSend className='h-[2%] w-5' />
                    </button>
                </form>
            )}
        </div>
    );
}

export default SendMessage;
