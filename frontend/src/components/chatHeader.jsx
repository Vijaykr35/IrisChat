import { useSelector, useDispatch } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';
import { IoArrowBack } from "react-icons/io5";

function ChatHeader({ darkMode }) {
    const dispatch = useDispatch();
    const selectedUser = useSelector((store) => store.user.selectedUser);
    const authUser = useSelector((store) => store.user.authUser);
    const onlineUsers = useSelector((store) => store.user.onlineUsers);
    const isOnline = onlineUsers?.some((id) => id === selectedUser?._id);

    if (!selectedUser) {
        return (
            <div className="flex justify-center text-lg sm:text-2xl p-4">
                <h1>Hi there {authUser?.fullName || authUser?.username}, let's start a conversation!</h1>
            </div>
        );
    }

    return (
        <div
            className={`sticky top-0 z-30 px-3 sm:px-4 h-14 sm:h-16 flex gap-2.5 sm:gap-3 items-center shadow-sm transition-colors duration-200 border-b ${
                darkMode ? 'bg-[#202c33] border-[#313d45] text-[#e9edef]' : 'bg-[#f0f2f5] border-[#d1d7db] text-[#111b21]'
            }`}
        >
            {/* Mobile Back Button: Returns to Contact List */}
            <button
                onClick={() => dispatch(setSelectedUser(null))}
                className="md:hidden p-1.5 -ml-1 rounded-full transition-colors hover:bg-black/10 dark:hover:bg-white/10 text-[#00a884] active:scale-95 flex items-center justify-center"
                title="Back to contacts"
                aria-label="Back to contacts"
            >
                <IoArrowBack size={22} />
            </button>

            {/* Contact Avatar */}
            <div className="relative flex-shrink-0">
                <img 
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover" 
                    src={selectedUser?.profilePhoto || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                    alt={selectedUser?.username || "user"} 
                    onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; }}
                />
                {isOnline && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#202c33]" />
                )}
            </div>

            {/* Contact Info */}
            <div className="flex flex-col flex-grow min-w-0">
                <h2 className="font-semibold text-sm sm:text-base truncate leading-tight">
                    {selectedUser?.fullName || selectedUser?.username}
                </h2>
                <span className={`text-[11px] sm:text-xs truncate ${isOnline ? 'text-[#00a884] font-medium' : 'text-[#8696a0]'}`}>
                    {isOnline ? 'online' : 'offline'}
                </span>
            </div>
        </div>
    );
}

export default ChatHeader;
