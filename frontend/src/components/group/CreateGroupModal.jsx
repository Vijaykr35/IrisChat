import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setGroups, setSelectedGroup } from '../../redux/groupSlice';
import { FiX, FiUsers, FiCheck } from 'react-icons/fi';

export default function CreateGroupModal({ isOpen, onClose, darkMode }) {
    const dispatch = useDispatch();
    const otherUsersData = useSelector((store) => store.user.otherUsers);
    const groups = useSelector((store) => store.group.groups);
    const usersList = otherUsersData?.otherUsers || [];

    const [groupName, setGroupName] = useState('');
    const [selectedMemberIds, setSelectedMemberIds] = useState([]);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const toggleSelectUser = (userId) => {
        if (selectedMemberIds.includes(userId)) {
            setSelectedMemberIds(selectedMemberIds.filter(id => id !== userId));
        } else {
            setSelectedMemberIds([...selectedMemberIds, userId]);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!groupName.trim()) {
            toast.error("Please enter a group name");
            return;
        }

        if (selectedMemberIds.length === 0) {
            toast.error("Please select at least 1 other member to start a group");
            return;
        }

        try {
            setLoading(true);
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api/v1";
            const res = await axios.post(
                `${backendUrl}/group/create`,
                {
                    groupName: groupName.trim(),
                    participants: selectedMemberIds
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            if (res.data.success) {
                toast.success("Group created successfully!");
                dispatch(setGroups([res.data.group, ...groups]));
                dispatch(setSelectedGroup(res.data.group));
                setGroupName('');
                setSelectedMemberIds([]);
                onClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create group");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className={`w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col max-h-[90vh] ${darkMode ? 'bg-[#202c33] text-[#e9edef]' : 'bg-white text-[#111b21]'}`}>
                {/* Header */}
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#00a884] flex items-center justify-center text-white">
                            <FiUsers size={18} />
                        </div>
                        <h2 className="text-xl font-semibold tracking-tight">Create New Group</h2>
                    </div>
                    <button onClick={onClose} className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-[#374248] text-[#aebac1]' : 'hover:bg-[#f0f2f5] text-[#54656f]'}`}>
                        <FiX size={20} />
                    </button>
                </div>

                <form onSubmit={handleCreate} className="flex flex-col flex-1 overflow-hidden">
                    {/* Group Name Input */}
                    <div className="mb-4">
                        <label className={`block text-xs font-semibold uppercase mb-1.5 ${darkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>Group Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Project Team, Weekend Plans..."
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            required
                            className={`w-full p-2.5 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#00a884] transition-colors text-sm ${darkMode ? 'bg-[#2a3942] text-[#d1d7db] placeholder-[#8696a0]' : 'bg-[#f0f2f5] text-[#111b21] placeholder-[#667781]'}`}
                        />
                    </div>

                    {/* Member Selection */}
                    <div className="flex flex-col flex-1 overflow-hidden mb-4">
                        <div className="flex justify-between items-center mb-1.5">
                            <label className={`text-xs font-semibold uppercase ${darkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>
                                Select Members ({selectedMemberIds.length} selected)
                            </label>
                        </div>

                        <div className={`flex-1 overflow-y-auto space-y-1.5 pr-1 rounded-lg p-2 border ${darkMode ? 'border-[#313d45] bg-[#111b21]' : 'border-gray-200 bg-gray-50'}`}>
                            {usersList.length === 0 ? (
                                <p className="text-xs text-center py-4 text-gray-500">No other users found</p>
                            ) : (
                                usersList.map((user) => {
                                    const isSelected = selectedMemberIds.includes(user._id);
                                    return (
                                        <div
                                            key={user._id}
                                            onClick={() => toggleSelectUser(user._id)}
                                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                                                isSelected
                                                    ? (darkMode ? 'bg-[#00a884]/20 border border-[#00a884]' : 'bg-[#00a884]/10 border border-[#00a884]')
                                                    : (darkMode ? 'hover:bg-[#202c33]' : 'hover:bg-gray-200')
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <img
                                                    src={user.profilePhoto || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                                    alt={user.username}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                    onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
                                                />
                                                <div className="truncate">
                                                    <p className="text-sm font-medium leading-none truncate">{user.fullName || user.username}</p>
                                                    <p className={`text-xs mt-0.5 truncate ${darkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>@{user.username}</p>
                                                </div>
                                            </div>

                                            <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                                                isSelected ? 'bg-[#00a884] text-white' : (darkMode ? 'border border-[#8696a0]' : 'border border-gray-400')
                                            }`}>
                                                {isSelected && <FiCheck size={14} />}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'hover:bg-[#374248] text-[#aebac1]' : 'hover:bg-gray-200 text-[#54656f]'}`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2 rounded-lg text-sm font-medium bg-[#00a884] hover:bg-[#008f6f] text-white transition-colors disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create Group"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

