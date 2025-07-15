import React from 'react'
import { useSelector } from 'react-redux';
function chatHeader() {
    const selectedUser = useSelector((store) => store.user.selectedUser);
    const authUser = useSelector((store) => store.user.authUser);

    if (!selectedUser) return <div className='flex justify-center text-2xl'><h1>Hi there {authUser?.fullName},Let's Start a Conversation !!! 😀😀😀</h1></div>;


    return (
        <div
            className={` p-4 border-b flex gap-4 items-cente bg-[#243642] border-white border-900
                `}
        >

            <img className='w-12 h-12 rounded-full object-cover' src={selectedUser?.profilePhoto} alt="img" />


            {/* User Info */}
            <div className="flex flex-col flex-grow">

                <h2 className="font-medium  text-white text-lg truncate">{selectedUser?.fullName}</h2>

            </div>


        </div>

    )
}

export default chatHeader;