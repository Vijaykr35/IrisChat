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
    const messages = useSelector(store => store.message.messages) || [];

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

            dispatch(setMessages([...messages, res?.data?.newMessage]));
            setMessage('');
        } catch (err) {
            console.log(`Error: ${err}`);
        }
    };

    return (
        <div className={`fixed bottom-0 right-0 w-3/4 p-6 border-t backdrop-blur-md ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-gray-200'} transition-colors duration-300 z-20`}>
            {showEmojiPicker && (
                <div className="absolute bottom-16">
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
            )}
            {selectedUser && (
                <form onSubmit={onSubmitHandler} className="flex items-center gap-3">
                    <button type="button" className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-gray-200 text-gray-500'}`} onClick={() => setShowEmojiPicker(prev => !prev)}>
                        <CiFaceSmile size={28} />
                    </button>

                    <input
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        type="text"
                        placeholder="Type a message..."
                        className={`flex-1 p-4 rounded-3xl border focus:outline-none focus:ring-2 shadow-inner transition-all ${darkMode ? 'bg-slate-800 text-gray-200 border-slate-700 focus:ring-indigo-500' : 'bg-gray-50 text-gray-900 border-gray-300 focus:ring-indigo-500'}`}
                    />

                    <button
                        type="submit"
                        className={`p-4 rounded-full bg-indigo-600 text-white shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all`}
                    >
                        <IoMdSend className='w-6 h-6' />
                    </button>
                </form>
            )}
        </div>
    );
}

export default SendMessage;
