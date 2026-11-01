import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setGroups, setSelectedGroup } from '../../redux/groupSlice';
import { FiPlus, FiUsers } from 'react-icons/fi';
import { LiaSearchSolid } from 'react-icons/lia';
import CreateGroupModal from './CreateGroupModal';

export default function GroupList({ darkMode, searchQuery = '', onClearSearch }) {
    const dispatch = useDispatch();
    const { groups, selectedGroup } = useSelector((store) => store.group);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                setLoading(true);
                const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api/v1";
                const res = await axios.get(`${backendUrl}/group`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    dispatch(setGroups(res.data.groups));
                }
            } catch (error) {
                console.error("Error fetching groups:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, [dispatch]);

    const query = searchQuery.trim().toLowerCase();
    const filteredGroups = query
        ? groups.filter((g) => g.groupName.toLowerCase().includes(query))
        : groups;

    // Safely render highlighted text wrapped in concrete spans (Chrome reconcile safe)
    const renderHighlightedText = (text) => {
        if (!text) return null;
        if (!query) return <span>{text}</span>;
        const idx = text.toLowerCase().indexOf(query);
        if (idx === -1) return <span>{text}</span>;

        const before = text.slice(0, idx);
        const match = text.slice(idx, idx + query.length);
        const after = text.slice(idx + query.length);

        return (
            <span>
                {before ? <span>{before}</span> : null}
                <span className="text-[#00a884] font-semibold bg-[#00a884]/15 px-0.5 rounded">
                    {match}
                </span>
                {after ? <span>{after}</span> : null}
            </span>
        );
    };

    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            {/* New Group Button */}
            <div className="p-3 border-b border-inherit">
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium bg-[#00a884] hover:bg-[#008f6f] text-white transition-all shadow-sm active:scale-98"
                >
                    <FiPlus size={18} /> New Group
                </button>
            </div>

            {/* Search Result Counter Bar */}
            {query ? (
                <div
                    key="group-search-counter"
                    className={`px-3 py-1.5 text-[11px] font-medium border-b flex items-center justify-between transition-colors ${
                        darkMode
                            ? 'bg-[#182229] border-[#313d45] text-[#8696a0]'
                            : 'bg-[#f0f2f5] border-gray-200 text-[#54656f]'
                    }`}
                >
                    <span>
                        {filteredGroups.length} {filteredGroups.length === 1 ? 'group' : 'groups'} found
                    </span>
                    {onClearSearch ? (
                        <button
                            type="button"
                            onClick={onClearSearch}
                            className="text-[#00a884] font-semibold hover:underline"
                        >
                            Clear
                        </button>
                    ) : null}
                </div>
            ) : null}

            {/* Groups Scrollable List */}
            <div className="flex-1 overflow-y-auto space-y-1 p-2">
                {loading && groups.length === 0 ? (
                    <div key="loading-state" className="text-center py-8 text-xs text-gray-500">
                        Loading groups...
                    </div>
                ) : query && filteredGroups.length === 0 ? (
                    <div
                        key="empty-group-search-state"
                        className="flex flex-col items-center justify-center py-10 px-4 text-center select-none"
                    >
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                                darkMode ? 'bg-[#202c33] text-[#8696a0]' : 'bg-gray-100 text-gray-400'
                            }`}
                        >
                            <LiaSearchSolid size={24} />
                        </div>
                        <p className="text-sm font-semibold mb-1">
                            <span>No groups found</span>
                        </p>
                        <p
                            className={`text-xs max-w-[200px] mb-3 ${
                                darkMode ? 'text-[#8696a0]' : 'text-[#667781]'
                            }`}
                        >
                            <span>No results matching &ldquo;</span>
                            <span className="font-semibold text-[#00a884]">{searchQuery}</span>
                            <span>&rdquo;.</span>
                        </p>
                        {onClearSearch ? (
                            <button
                                type="button"
                                onClick={onClearSearch}
                                className="text-xs font-semibold text-[#00a884] hover:underline"
                            >
                                Clear search
                            </button>
                        ) : null}
                    </div>
                ) : filteredGroups.length === 0 ? (
                    <div
                        key="empty-group-list-state"
                        className="flex flex-col items-center justify-center py-10 px-4 text-center select-none"
                    >
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                                darkMode ? 'bg-[#202c33] text-[#8696a0]' : 'bg-gray-100 text-gray-500'
                            }`}
                        >
                            <FiUsers size={22} />
                        </div>
                        <p className="text-sm font-medium">No groups yet</p>
                        <p
                            className={`text-xs mt-1 max-w-[200px] ${
                                darkMode ? 'text-[#8696a0]' : 'text-[#667781]'
                            }`}
                        >
                            Create a group with your contacts to chat together!
                        </p>
                    </div>
                ) : (
                    <div key="groups-list-container">
                        {filteredGroups.map((group) => {
                            const isSelected = selectedGroup?._id === group._id;
                            return (
                                <div
                                    key={group._id}
                                    onClick={() => dispatch(setSelectedGroup(group))}
                                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors select-none ${
                                        isSelected
                                            ? (darkMode ? 'bg-[#2a3942]' : 'bg-[#e9edef]')
                                            : (darkMode ? 'hover:bg-[#202c33]' : 'hover:bg-[#f5f6f6]')
                                    }`}
                                >
                                    <img
                                        src={
                                            group.groupPhoto ||
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                group.groupName
                                            )}&background=00a884&color=fff`
                                        }
                                        alt={group.groupName}
                                        className="w-11 h-11 rounded-full object-cover shadow-sm flex-shrink-0"
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                group.groupName
                                            )}&background=00a884&color=fff`;
                                        }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <h3
                                                className={`font-semibold text-sm truncate ${
                                                    darkMode ? 'text-[#e9edef]' : 'text-[#111b21]'
                                                }`}
                                            >
                                                {renderHighlightedText(group.groupName)}
                                            </h3>
                                        </div>
                                        <p
                                            className={`text-xs truncate mt-0.5 ${
                                                darkMode ? 'text-[#8696a0]' : 'text-[#667781]'
                                            }`}
                                        >
                                            {group.participants?.length || 0} members
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <CreateGroupModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                darkMode={darkMode}
            />
        </div>
    );
}
