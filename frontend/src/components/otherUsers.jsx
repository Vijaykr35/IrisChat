import React from 'react'
import OtherUser from './otherUser';
import useGetOtherUsers from '../hooks/useGetOtherUsers';
import { useSelector } from 'react-redux';
function otherUsers({ darkMode }) {
    useGetOtherUsers();
    const state = useSelector((store) => store);
    


    const { otherUsers } = useSelector((store) => store.user.otherUsers || { otherUsers: [] });
    

    return (
        <div className="p-4 space-y-3 overflow-y-auto h-[calc(100vh-150px)]">
            {
                otherUsers.map((user) =>
                    <OtherUser key={user._id} user={user} darkMode={darkMode} />
                )
            }
        </div>

    )
}

export default otherUsers;