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
                `${import.meta.env.VITE_BACKEND_URL}/message/send/${selectedUser._id}`,
                { message },
                { headers: { "Content-Type": "application/json" }, withCredentials: true }
            );

            dispatch(setMessages([...messages, res?.data?.newMessage]));
            setMessage('');
        } catch (err) {
            console.error(`Error: ${err}`);
        }
    };

    return (
        <div className={`w-full h-16 px-4 flex items-center sticky bottom-0 border-t transition-colors duration-300 z-20 ${darkMode ? 'bg-[#202c33] border-[#313d45]' : 'bg-[#f0f2f5] border-[#d1d7db]'}`}>
            {showEmojiPicker && (
                <div className="absolute bottom-16">
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
            )}
            {selectedUser && (
                <form onSubmit={onSubmitHandler} className="flex-1 flex items-center gap-3">
                    <button type="button" className={`p-2 rounded-full transition-colors ${darkMode ? 'text-[#8696a0] hover:bg-[#374248]' : 'text-[#54656f] hover:bg-[#e9edef]'}`} onClick={() => setShowEmojiPicker(prev => !prev)}>
                        <CiFaceSmile size={28} />
                    </button>

                    <input
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        type="text"
                        placeholder="Type a message"
                        className={`flex-1 p-2 px-4 rounded-lg border-none focus:outline-none focus:ring-1 focus:ring-[#00a884] transition-colors ${darkMode ? 'bg-[#2a3942] text-[#d1d7db] placeholder-[#8696a0]' : 'bg-[#ffffff] text-[#111b21] placeholder-[#667781]'}`}
                    />

                    <button
                        type="submit"
                        className={`p-2 rounded-full transition-all hover:text-[#00a884] ${darkMode ? 'text-[#8696a0] hover:bg-[#374248]' : 'text-[#54656f] hover:bg-[#e9edef]'}`}
                    >
                        <IoMdSend className='w-7 h-7' />
                    </button>
                </form>
            )}
        </div>
    );
}

export default SendMessage;
