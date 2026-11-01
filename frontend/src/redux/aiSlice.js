import { createSlice } from "@reduxjs/toolkit";

const aiSlice = createSlice({
    name: "ai",
    initialState: {
        conversations: [],
        currentConversation: null,
        aiMessages: [],
        loadingAI: false,
    },
    reducers: {
        setAiConversations: (state, action) => {
            state.conversations = action.payload || [];
        },
        setCurrentConversation: (state, action) => {
            state.currentConversation = action.payload;
            state.aiMessages = action.payload?.messages || [];
        },
        setAiMessages: (state, action) => {
            state.aiMessages = action.payload || [];
        },
        addAiMessage: (state, action) => {
            state.aiMessages.push(action.payload);
        },
        setLoadingAI: (state, action) => {
            state.loadingAI = action.payload;
        },
        removeAiConversation: (state, action) => {
            const id = action.payload;
            state.conversations = state.conversations.filter(c => c._id !== id);
            if (state.currentConversation?._id === id) {
                state.currentConversation = null;
                state.aiMessages = [];
            }
        }
    }
});

export const {
    setAiConversations,
    setCurrentConversation,
    setAiMessages,
    addAiMessage,
    setLoadingAI,
    removeAiConversation
} = aiSlice.actions;

export default aiSlice.reducer;

