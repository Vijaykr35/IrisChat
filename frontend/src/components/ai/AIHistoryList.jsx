import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
    setAiConversations,
    setCurrentConversation,
    removeAiConversation
} from '../../redux/aiSlice';
import { FiPlus, FiMessageSquare, FiTrash2, FiCpu } from 'react-icons/fi';
import { LiaSearchSolid } from 'react-icons/lia';
import toast from 'react-hot-toast';

export default function AIHistoryList({ darkMode, searchQuery = "", onClearSearch }) {
    const dispatch = useDispatch();
    const { conversations, currentConversation } = useSelector((store) => store.ai);

    const fetchConversations = async () => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api/v1";
            const res = await axios.get(`${backendUrl}/ai/conversations`, {
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setAiConversations(res.data.conversations));
            }
        } catch (error) {
            console.error("Error fetching AI conversations:", error);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, [dispatch]);

    const handleSelectConversation = async (conv) => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api/v1";
            const res = await axios.get(`${backendUrl}/ai/conversation/${conv._id}`, {
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setCurrentConversation(res.data.conversation));
            }
        } catch (error) {
            toast.error("Failed to load conversation");
        }
    };

    const handleNewChat = () => {
        dispatch(setCurrentConversation(null));
        if (onClearSearch) onClearSearch();
    };

    const handleDeleteConversation = async (e, id) => {
        e.stopPropagation();
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api/v1";
            const res = await axios.delete(`${backendUrl}/ai/conversation/${id}`, {
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(removeAiConversation(id));
                toast.success("Conversation deleted");
            }
        } catch (error) {
            toast.error("Failed to delete conversation");
        }
    };

    const query = searchQuery.trim().toLowerCase();
    const filteredConversations = query
        ? conversations.filter((c) => {
            const titleMatch = c.title?.toLowerCase().includes(query);
            const msgMatch = c.messages?.some((m) => m.text?.toLowerCase().includes(query));
            return titleMatch || msgMatch;
        })
        : conversations;

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
            {/* New Chat Button */}
            <div className="p-3 border-b border-inherit">
                <button
                    onClick={handleNewChat}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium bg-[#00a884] hover:bg-[#008f6f] text-white transition-all shadow-sm active:scale-98"
                >
                    <FiPlus size={18} /> New AI Chat
                </button>
            </div>

            {/* Search Result Counter Bar */}
            {query ? (
                <div
                    key="ai-search-counter"
                    className={`px-3 py-1.5 text-[11px] font-medium border-b flex items-center justify-between transition-colors ${
                        darkMode
                            ? 'bg-[#182229] border-[#313d45] text-[#8696a0]'
                            : 'bg-[#f0f2f5] border-gray-200 text-[#54656f]'
                    }`}
                >
                    <span>
                        {filteredConversations.length} {filteredConversations.length === 1 ? 'chat' : 'chats'} found
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

            {/* Conversation History */}
            <div className="flex-1 overflow-y-auto space-y-1 p-2">
                {query && filteredConversations.length === 0 ? (
                    <div
                        key="empty-ai-search-state"
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
                            <span>No AI chats found</span>
                        </p>
                        <p
                            className={`text-xs max-w-[200px] mb-3 ${
                                darkMode ? 'text-[#8696a0]' : 'text-[#667781]'
                            }`}
                        >
                            <span>No conversations matching &ldquo;</span>
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
                ) : conversations.length === 0 ? (
                    <div
                        key="empty-ai-list-state"
                        className="flex flex-col items-center justify-center py-10 px-4 text-center select-none"
                    >
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                                darkMode ? 'bg-[#202c33] text-[#8696a0]' : 'bg-gray-100 text-gray-500'
                            }`}
                        >
                            <FiCpu size={22} />
                        </div>
                        <p className="text-sm font-medium">No AI Chats Yet</p>
                        <p
                            className={`text-xs mt-1 max-w-[200px] ${
                                darkMode ? 'text-[#8696a0]' : 'text-[#667781]'
                            }`}
                        >
                            Ask questions, get help coding, or brainstorm with AI.
                        </p>
                    </div>
                ) : (
                    <div key="conversations-list-container">
                        {filteredConversations.map((conv) => {
                            const isSelected = currentConversation?._id === conv._id;
                            return (
                                <div
                                    key={conv._id}
                                    onClick={() => handleSelectConversation(conv)}
                                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer group transition-colors select-none ${
                                        isSelected
                                            ? (darkMode ? 'bg-[#2a3942]' : 'bg-[#e9edef]')
                                            : (darkMode ? 'hover:bg-[#202c33]' : 'hover:bg-[#f5f6f6]')
                                    }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className="w-8 h-8 rounded-lg bg-[#00a884]/20 text-[#00a884] flex items-center justify-center flex-shrink-0">
                                            <FiMessageSquare size={16} />
                                        </div>
                                        <div className="truncate flex-1">
                                            <p
                                                className={`text-sm font-medium truncate ${
                                                    darkMode ? 'text-[#e9edef]' : 'text-[#111b21]'
                                                }`}
                                            >
                                                {renderHighlightedText(conv.title || "Untitled Chat")}
                                            </p>
                                            <p
                                                className={`text-[10px] mt-0.5 ${
                                                    darkMode ? 'text-[#8696a0]' : 'text-[#667781]'
                                                }`}
                                            >
                                                {new Date(conv.updatedAt || conv.createdAt).toLocaleDateString([], {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={(e) => handleDeleteConversation(e, conv._id)}
                                        title="Delete conversation"
                                        className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-500/10 transition-all text-[#8696a0]"
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
