import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
    setCurrentConversation,
    addAiMessage,
    setLoadingAI,
    setAiConversations
} from '../../redux/aiSlice';
import { IoMdSend } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import { FiPlus, FiAlertCircle, FiMaximize2, FiClock, FiX } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import FormattedMessage from './FormattedMessage';
import AIHistoryList from './AIHistoryList';
import toast from 'react-hot-toast';

export default function AIChatView({ darkMode, onBack }) {
    const dispatch = useDispatch();
    const { currentConversation, aiMessages, loadingAI, conversations } = useSelector((store) => store.ai);
    const authUser = useSelector((store) => store.user.authUser);

    const [prompt, setPrompt] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
    const [chatbarHeight, setChatbarHeight] = useState(() => {
        const saved = localStorage.getItem("irischat_chatbar_height") || localStorage.getItem("chaatter_chatbar_height");
        return saved ? Math.max(60, Math.min(220, parseInt(saved, 10))) : 60;
    });
    const [isResizing, setIsResizing] = useState(false);
    const messagesEndRef = useRef(null);

    // Vertical drag-to-resize chatbar height (Desktop only)
    const startResizing = (e) => {
        e.preventDefault();
        setIsResizing(true);
    };

    useEffect(() => {
        if (!isResizing) return;
        const handleMouseMove = (e) => {
            const newHeight = Math.max(60, Math.min(240, window.innerHeight - e.clientY));
            setChatbarHeight(newHeight);
            localStorage.setItem("irischat_chatbar_height", newHeight.toString());
        };
        const handleMouseUp = () => setIsResizing(false);

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizing]);

    // Auto scroll smoothly to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [aiMessages, loadingAI]);

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        const trimmed = prompt.trim();
        if (!trimmed || loadingAI) return;

        setErrorMsg("");
        setPrompt("");

        // Add user prompt to state immediately
        const tempUserMessage = {
            role: "user",
            text: trimmed,
            createdAt: new Date()
        };
        dispatch(addAiMessage(tempUserMessage));
        dispatch(setLoadingAI(true));

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api/v1";
            const res = await axios.post(
                `${backendUrl}/ai/chat`,
                {
                    prompt: trimmed,
                    conversationId: currentConversation?._id
                },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            );

            if (res.data.success) {
                dispatch(addAiMessage(res.data.assistantMessage));

                // Update current conversation reference and conversation list
                if (!currentConversation) {
                    dispatch(setCurrentConversation(res.data.conversation));
                    dispatch(setAiConversations([res.data.conversation, ...conversations]));
                } else {
                    dispatch(setCurrentConversation(res.data.conversation));
                }
            }
        } catch (error) {
            console.error("AI Error:", error);
            const msg = error.response?.data?.message || "Failed to get AI response. Please verify your connection.";
            setErrorMsg(msg);
            toast.error(msg);
        } finally {
            dispatch(setLoadingAI(false));
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleStartNewChat = () => {
        dispatch(setCurrentConversation(null));
        setPrompt("");
        setErrorMsg("");
        setIsHistoryDrawerOpen(false);
    };

    const handleSuggestionClick = (suggestionText) => {
        setPrompt(suggestionText);
    };

    return (
        <div className="flex-1 w-full flex flex-col min-h-0 relative h-full">
            {/* Header */}
            <div
                className={`sticky top-0 z-30 px-3 sm:px-4 h-14 sm:h-16 flex justify-between items-center shadow-sm border-b transition-colors duration-200 ${
                    darkMode ? 'bg-[#202c33] border-[#313d45] text-[#e9edef]' : 'bg-[#f0f2f5] border-[#d1d7db] text-[#111b21]'
                }`}
            >
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    {/* Mobile Back Button: Returns to Chats Tab */}
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="md:hidden p-1.5 -ml-1 rounded-full transition-colors hover:bg-black/10 dark:hover:bg-white/10 text-[#00a884] active:scale-95 flex items-center justify-center flex-shrink-0"
                            title="Back to chats"
                            aria-label="Back to chats"
                        >
                            <IoArrowBack size={22} />
                        </button>
                    )}

                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#00a884] to-[#25d366] flex items-center justify-center text-white shadow-md flex-shrink-0">
                        <BsStars size={18} className="sm:text-[20px]" />
                    </div>
                    <div className="truncate">
                        <h2 className="font-semibold text-sm sm:text-base leading-tight truncate">
                            {currentConversation?.title || "AI Assistant"}
                        </h2>
                        <p className={`text-[11px] sm:text-xs truncate ${darkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>
                            {currentConversation ? "Multi-turn session" : "IrisChat Assistant"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    {/* Mobile History Drawer Button */}
                    <button
                        onClick={() => setIsHistoryDrawerOpen(true)}
                        className={`flex md:hidden items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            darkMode ? 'bg-[#2a3942] text-[#d1d7db] hover:bg-[#374248]' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                        title="Past AI Conversations"
                        aria-label="Past AI Conversations"
                    >
                        <FiClock size={14} className="text-[#00a884]" />
                        <span>History</span>
                        {conversations?.length > 0 && (
                            <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-[#00a884]/20 text-[#00a884] font-semibold">
                                {conversations.length}
                            </span>
                        )}
                    </button>

                    {/* New Chat Button */}
                    <button
                        onClick={handleStartNewChat}
                        className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#00a884] hover:bg-[#008f6f] text-white shadow-sm transition-all active:scale-95"
                        title="Start fresh conversation"
                    >
                        <FiPlus size={15} />
                        <span className="hidden xs:inline sm:inline">New</span>
                    </button>
                </div>
            </div>

            {/* Mobile AI History Slide-over Drawer */}
            {isHistoryDrawerOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    {/* Backdrop */}
                    <div
                        onClick={() => setIsHistoryDrawerOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                    />

                    {/* Drawer Panel */}
                    <div
                        className={`relative w-4/5 max-w-xs h-full flex flex-col z-10 shadow-2xl transition-transform ${
                            darkMode ? 'bg-[#111b21] text-[#e9edef]' : 'bg-white text-[#111b21]'
                        }`}
                    >
                        <div className={`p-4 border-b flex items-center justify-between ${
                            darkMode ? 'border-[#313d45] bg-[#202c33]' : 'border-gray-200 bg-[#f0f2f5]'
                        }`}>
                            <div className="flex items-center gap-2">
                                <FiClock className="text-[#00a884]" size={18} />
                                <h3 className="font-semibold text-sm">Past Conversations</h3>
                            </div>
                            <button
                                onClick={() => setIsHistoryDrawerOpen(false)}
                                className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
                                aria-label="Close"
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        <div
                            className="flex-1 overflow-y-auto"
                            onClick={(e) => {
                                // Close drawer if a conversation item or delete was clicked
                                if (e.target.closest('button') || e.target.closest('.cursor-pointer')) {
                                    setIsHistoryDrawerOpen(false);
                                }
                            }}
                        >
                            <AIHistoryList darkMode={darkMode} />
                        </div>
                    </div>
                </div>
            )}

            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto p-2.5 sm:p-4 pb-4 space-y-3 sm:space-y-4 scroll-smooth touch-pan-y">
                {aiMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[45vh] sm:min-h-[55vh] text-center px-3 select-none">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#00a884] to-[#00d084] flex items-center justify-center text-white shadow-lg mb-3">
                            <BsStars size={28} className="sm:text-[32px]" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold mb-1.5">How can I help you today?</h3>
                        <p className={`max-w-md text-xs sm:text-sm mb-5 ${darkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>
                            Ask questions, get help writing messages, brainstorm ideas, or generate code.
                        </p>

                        {/* Suggestions */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full">
                            {[
                                "💡 Explain how WebSockets work simply",
                                "📝 Help me draft a professional message",
                                "⚡ Write a JavaScript debounce function",
                                "🎯 Tips for effective team communication"
                            ].map((suggestion, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSuggestionClick(suggestion.slice(3))}
                                    className={`p-2.5 sm:p-3 text-left rounded-xl text-xs font-medium border transition-all active:scale-95 ${
                                        darkMode
                                            ? 'bg-[#202c33] border-[#313d45] hover:border-[#00a884] text-[#d1d7db]'
                                            : 'bg-white border-gray-200 hover:border-[#00a884] text-gray-700'
                                    }`}
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    aiMessages.map((msg, index) => {
                        const isUser = msg.role === "user";
                        return (
                            <div key={index} className={`chat ${isUser ? 'chat-end' : 'chat-start'} animate-message my-0.5 sm:my-1`}>
                                {!isUser && (
                                    <div className="chat-image avatar">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#00a884] to-[#25d366] flex items-center justify-center text-white p-1 shadow-sm">
                                            <BsStars size={14} className="sm:text-[16px]" />
                                        </div>
                                    </div>
                                )}

                                <div className="chat-header mb-1 opacity-75">
                                    <span className="font-semibold text-xs text-[#00a884]">
                                        {isUser ? (authUser?.username || "You") : "AI Assistant"}
                                    </span>
                                    <time className="text-[10px] ml-2 opacity-60">
                                        {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                    </time>
                                </div>

                                <div
                                    className={`chat-bubble py-2 px-3 sm:py-2.5 sm:px-3.5 text-[14px] sm:text-[15px] leading-relaxed shadow-sm break-words max-w-[88%] sm:max-w-xl md:max-w-2xl select-text ${
                                        isUser
                                            ? (darkMode ? 'bg-[#005c4b] text-[#e9edef] rounded-2xl rounded-tr-none' : 'bg-[#d9fdd3] text-[#111b21] rounded-2xl rounded-tr-none')
                                            : (darkMode ? 'bg-[#202c33] text-[#e9edef] rounded-2xl rounded-tl-none border border-white/5' : 'bg-[#ffffff] text-[#111b21] rounded-2xl rounded-tl-none border border-gray-200')
                                    }`}
                                >
                                    {isUser ? (
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                    ) : (
                                        <FormattedMessage text={msg.text} darkMode={darkMode} />
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}

                {/* Loading indicator while generating response */}
                {loadingAI && (
                    <div className="chat chat-start animate-message">
                        <div className="chat-image avatar">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#00a884] to-[#25d366] flex items-center justify-center text-white p-1 animate-pulse shadow-sm">
                                <BsStars size={14} className="sm:text-[16px]" />
                            </div>
                        </div>
                        <div className="chat-header mb-1 opacity-75">
                            <span className="font-semibold text-xs text-[#00a884]">AI Assistant</span>
                        </div>
                        <div className={`chat-bubble py-2.5 px-3.5 ${
                            darkMode ? 'bg-[#202c33] text-[#d1d7db]' : 'bg-white text-gray-800'
                        } rounded-2xl rounded-tl-none flex items-center gap-2 shadow-sm`}>
                            <div className="w-2 h-2 rounded-full bg-[#00a884] animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 rounded-full bg-[#00a884] animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 rounded-full bg-[#00a884] animate-bounce" style={{ animationDelay: '300ms' }} />
                            <span className="text-xs text-[#8696a0] ml-1">AI is thinking...</span>
                        </div>
                    </div>
                )}

                {/* Inline Error display if API fails */}
                {errorMsg && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs my-2">
                        <FiAlertCircle size={16} className="flex-shrink-0" />
                        <span>{errorMsg}</span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Prompt Input Form */}
            <div
                className={`w-full px-2 sm:px-4 py-1.5 sm:py-2 flex items-center relative border-t transition-colors duration-200 z-20 flex-shrink-0 ${
                    darkMode ? 'bg-[#202c33] border-[#313d45]' : 'bg-[#f0f2f5] border-[#d1d7db]'
                }`}
                style={{ minHeight: '56px' }}
            >
                {/* Top Resize Drag Handle (Desktop only) */}
                <div
                    onMouseDown={startResizing}
                    className="hidden sm:flex absolute -top-2 left-0 right-0 h-4 cursor-row-resize items-center justify-center group z-30 select-none"
                    title="Drag up or down to resize chatbar shape & height"
                >
                    <div className={`w-14 h-1 rounded-full transition-all ${
                        isResizing ? 'bg-[#00a884] h-1.5' : 'bg-transparent group-hover:bg-[#00a884]/70'
                    }`} />
                </div>

                <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-1.5 sm:gap-3 h-full">
                    {/* Auto-growing / compact textarea with iOS zoom prevention (text-base on mobile, text-sm on desktop) */}
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask AI anything..."
                        disabled={loadingAI}
                        rows={1}
                        className={`flex-1 py-2 px-3 sm:py-2.5 sm:px-4 rounded-2xl border-none resize-none focus:outline-none focus:ring-1 focus:ring-[#00a884] transition-all text-base sm:text-sm leading-normal max-h-32 ${
                            darkMode ? 'bg-[#2a3942] text-[#d1d7db] placeholder-[#8696a0]' : 'bg-[#ffffff] text-[#111b21] placeholder-[#667781]'
                        } disabled:opacity-50`}
                    />

                    <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                            type="button"
                            onClick={() => {
                                const next = chatbarHeight > 90 ? 60 : 130;
                                setChatbarHeight(next);
                                localStorage.setItem("irischat_chatbar_height", next.toString());
                            }}
                            className={`p-2 rounded-full transition-colors hidden sm:flex ${
                                darkMode ? 'text-[#8696a0] hover:bg-[#374248]' : 'text-[#54656f] hover:bg-[#e9edef]'
                            }`}
                            title={chatbarHeight > 90 ? "Compact Chatbar" : "Expand Chatbar"}
                        >
                            <FiMaximize2 size={16} />
                        </button>

                        {/* Touch-friendly Send Button */}
                        <button
                            type="submit"
                            disabled={!prompt.trim() || loadingAI}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all bg-[#00a884] text-white shadow-md active:scale-95 disabled:opacity-40 disabled:bg-transparent disabled:text-[#8696a0] disabled:shadow-none"
                            title="Send Prompt"
                            aria-label="Send Prompt"
                        >
                            <IoMdSend className="w-5 h-5 ml-0.5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
