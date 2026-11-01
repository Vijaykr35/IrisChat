import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedGroup } from '../../redux/groupSlice';
import { FiUsers, FiInfo } from 'react-icons/fi';
import { IoArrowBack } from "react-icons/io5";
import GroupMembersModal from './GroupMembersModal';

export default function GroupChatHeader({ darkMode }) {
    const dispatch = useDispatch();
    const { selectedGroup } = useSelector((store) => store.group);
    const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

    if (!selectedGroup) return null;

    const memberNames = selectedGroup.participants
        ?.map(p => p.fullName || p.username)
        .slice(0, 3)
        .join(', ');
    const moreCount = (selectedGroup.participants?.length || 0) - 3;
    const memberSummary = moreCount > 0 ? `${memberNames} +${moreCount} more` : memberNames;

    return (
        <>
            <div
                className={`sticky top-0 z-30 px-3 sm:px-4 h-14 sm:h-16 flex justify-between items-center shadow-sm transition-colors duration-200 border-b ${
                    darkMode ? 'bg-[#202c33] border-[#313d45] text-[#e9edef]' : 'bg-[#f0f2f5] border-[#d1d7db] text-[#111b21]'
                }`}
            >
                {/* Mobile Back Button: Return to Groups List */}
                <button
                    onClick={() => dispatch(setSelectedGroup(null))}
                    className="md:hidden p-1.5 -ml-1 mr-1 rounded-full transition-colors hover:bg-black/10 dark:hover:bg-white/10 text-[#00a884] active:scale-95 flex items-center justify-center flex-shrink-0"
                    title="Back to groups"
                    aria-label="Back to groups"
                >
                    <IoArrowBack size={22} />
                </button>

                <div
                    onClick={() => setIsMembersModalOpen(true)}
                    className="flex items-center gap-2.5 sm:gap-3 cursor-pointer flex-1 min-w-0"
                >
                    <img
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shadow-sm flex-shrink-0"
                        src={selectedGroup.groupPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedGroup.groupName)}&background=00a884&color=fff`}
                        alt={selectedGroup.groupName}
                        onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedGroup.groupName)}&background=00a884&color=fff`;
                        }}
                    />

                    <div className="flex flex-col truncate">
                        <h2 className="font-semibold text-sm sm:text-base truncate leading-tight">{selectedGroup.groupName}</h2>
                        <p className={`text-[11px] sm:text-xs truncate ${darkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>
                            {memberSummary || `${selectedGroup.participants?.length} members`}
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setIsMembersModalOpen(true)}
                    className={`p-2 rounded-full transition-colors flex-shrink-0 ${
                        darkMode ? 'hover:bg-[#374248] text-[#aebac1]' : 'hover:bg-[#d1d7db] text-[#54656f]'
                    }`}
                    title="Group Info & Members"
                >
                    <FiInfo size={19} />
                </button>
            </div>

            <GroupMembersModal
                isOpen={isMembersModalOpen}
                onClose={() => setIsMembersModalOpen(false)}
                darkMode={darkMode}
                group={selectedGroup}
            />
        </>
    );
}
