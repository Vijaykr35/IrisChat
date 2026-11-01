import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { updateGroupInList, removeGroupFromList } from '../../redux/groupSlice';
import { FiX, FiUserPlus, FiUserMinus, FiLogOut, FiShield } from 'react-icons/fi';

export default function GroupMembersModal({ isOpen, onClose, group, darkMode }) {
    const dispatch = useDispatch();
    const authUser = useSelector((store) => store.user.authUser);
    const otherUsersData = useSelector((store) => store.user.otherUsers);
    const usersList = otherUsersData?.otherUsers || [];

    const [showAddMember, setShowAddMember] = useState(false);
    const [selectedUserToAdd, setSelectedUserToAdd] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen || !group) return null;

    const isAdmin = group.groupAdmin?._id === authUser?._id || group.groupAdmin === authUser?._id;

    // Users not already in this group
    const currentMemberIds = group.participants.map(p => p._id || p);
    const availableUsersToAdd = usersList.filter(u => !currentMemberIds.includes(u._id));

    const handleAddMember = async () => {
        if (!selectedUserToAdd) return;
        try {
            setLoading(true);
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api/v1";
            const res = await axios.put(
                `${backendUrl}/group/${group._id}/add-member`,
                { userIdToAdd: selectedUserToAdd },
                { withCredentials: true }
            );

            if (res.data.success) {
                toast.success("Member added successfully!");
                dispatch(updateGroupInList(res.data.group));
                setSelectedUserToAdd('');
                setShowAddMember(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add member");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveMember = async (userIdToRemove, isSelf = false) => {
        const confirmMsg = isSelf 
            ? "Are you sure you want to leave this group?" 
            : "Are you sure you want to remove this member?";
        if (!window.confirm(confirmMsg)) return;

        try {
            setLoading(true);
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api/v1";
            const res = await axios.put(
                `${backendUrl}/group/${group._id}/remove-member`,
                { userIdToRemove },
                { withCredentials: true }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                if (isSelf) {
                    dispatch(removeGroupFromList(group._id));
                    onClose();
                } else {
                    dispatch(updateGroupInList(res.data.group));
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to remove member");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className={`w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col max-h-[85vh] ${darkMode ? 'bg-[#202c33] text-[#e9edef]' : 'bg-white text-[#111b21]'}`}>
                {/* Header */}
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight">{group.groupName}</h2>
                        <p className={`text-xs ${darkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>
                            {group.participants?.length} members
                        </p>
                    </div>
                    <button onClick={onClose} className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-[#374248] text-[#aebac1]' : 'hover:bg-[#f0f2f5] text-[#54656f]'}`}>
                        <FiX size={20} />
                    </button>
                </div>

                {/* Add Member Section (Admin Only) */}
                {isAdmin && (
                    <div className="mb-4">
                        {!showAddMember ? (
                            <button
                                onClick={() => setShowAddMember(true)}
                                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium border border-[#00a884] text-[#00a884] hover:bg-[#00a884]/10 transition-colors"
                            >
                                <FiUserPlus size={16} /> Add Member
                            </button>
                        ) : (
                            <div className={`p-3 rounded-xl border ${darkMode ? 'border-[#313d45] bg-[#111b21]' : 'border-gray-200 bg-gray-50'}`}>
                                <label className={`block text-xs font-semibold uppercase mb-1.5 ${darkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>Add User</label>
                                <div className="flex gap-2">
                                    <select
                                        value={selectedUserToAdd}
                                        onChange={(e) => setSelectedUserToAdd(e.target.value)}
                                        className={`flex-1 p-2 rounded-lg text-sm border-none focus:outline-none focus:ring-1 focus:ring-[#00a884] ${darkMode ? 'bg-[#2a3942] text-[#d1d7db]' : 'bg-white text-[#111b21]'}`}
                                    >
                                        <option value="">Select a user...</option>
                                        {availableUsersToAdd.map(u => (
                                            <option key={u._id} value={u._id}>{u.fullName || u.username} (@{u.username})</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleAddMember}
                                        disabled={!selectedUserToAdd || loading}
                                        className="px-3 py-1.5 bg-[#00a884] hover:bg-[#008f6f] text-white text-xs font-medium rounded-lg disabled:opacity-50"
                                    >
                                        Add
                                    </button>
                                    <button
                                        onClick={() => setShowAddMember(false)}
                                        className={`px-2 py-1.5 text-xs rounded-lg ${darkMode ? 'hover:bg-[#374248] text-[#aebac1]' : 'hover:bg-gray-200 text-[#54656f]'}`}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Members List */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-4">
                    {group.participants?.map((member) => {
                        const isMemberAdmin = (group.groupAdmin?._id || group.groupAdmin) === (member._id || member);
                        const isCurrentAuthUser = authUser?._id === (member._id || member);

                        return (
                            <div
                                key={member._id || member}
                                className={`flex items-center justify-between p-2.5 rounded-xl ${darkMode ? 'bg-[#111b21]' : 'bg-gray-100'}`}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <img
                                        src={member.profilePhoto || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                        alt={member.username}
                                        className="w-9 h-9 rounded-full object-cover"
                                        onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
                                    />
                                    <div className="truncate">
                                        <div className="flex items-center gap-1.5">
                                            <p className="text-sm font-medium leading-none truncate">
                                                {member.fullName || member.username}
                                                {isCurrentAuthUser && " (You)"}
                                            </p>
                                            {isMemberAdmin && (
                                                <span className="flex items-center gap-0.5 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#00a884]/20 text-[#00a884]">
                                                    <FiShield size={10} /> Admin
                                                </span>
                                            )}
                                        </div>
                                        <p className={`text-xs mt-0.5 truncate ${darkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>
                                            @{member.username}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions: Remove member (if admin and not self) */}
                                {isAdmin && !isCurrentAuthUser && (
                                    <button
                                        onClick={() => handleRemoveMember(member._id || member, false)}
                                        title="Remove member"
                                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                                    >
                                        <FiUserMinus size={16} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Leave Group Button */}
                <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                    <button
                        onClick={() => handleRemoveMember(authUser?._id, true)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <FiLogOut size={14} /> Leave Group
                    </button>
                    <button
                        onClick={onClose}
                        className={`px-4 py-2 text-sm rounded-lg font-medium ${darkMode ? 'hover:bg-[#374248] text-[#aebac1]' : 'hover:bg-gray-200 text-[#54656f]'}`}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

