import { useSelector } from 'react-redux';
function ChatHeader({ darkMode }) {
    const selectedUser = useSelector((store) => store.user.selectedUser);
    const authUser = useSelector((store) => store.user.authUser);

    if (!selectedUser) return <div className='flex justify-center text-2xl'><h1>Hi there {authUser?.fullName},Let's Start a Conversation !!! 😀😀😀</h1></div>;


    return (
        <div
            className={`sticky top-0 z-30 px-4 h-16 flex gap-4 items-center shadow-sm transition-colors duration-300 border-b ${darkMode ? 'bg-[#202c33] border-[#313d45] text-[#e9edef]' : 'bg-[#f0f2f5] border-[#d1d7db] text-[#111b21]'}`}
        >
            <img 
                 className='w-10 h-10 rounded-full object-cover' 
                 src={selectedUser?.profilePhoto || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                 alt="img" 
                 onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
            />


            {/* User Info */}
            <div className="flex flex-col flex-grow">
                <h2 className="font-medium text-lg truncate">{selectedUser?.fullName}</h2>
            </div>


        </div>

    )
}

export default ChatHeader;