import { createSlice } from "@reduxjs/toolkit";

const groupSlice = createSlice({
    name: "group",
    initialState: {
        groups: [],
        selectedGroup: null,
        groupMessages: [],
    },
    reducers: {
        setGroups: (state, action) => {
            state.groups = action.payload || [];
        },
        setSelectedGroup: (state, action) => {
            state.selectedGroup = action.payload;
        },
        setGroupMessages: (state, action) => {
            state.groupMessages = action.payload || [];
        },
        addGroupMessage: (state, action) => {
            const newMsg = action.payload;
            if (!newMsg) return;
            // Check if message already exists
            const exists = state.groupMessages.some(m => m._id && newMsg._id && m._id === newMsg._id);
            if (!exists) {
                state.groupMessages.push(newMsg);
            }
        },
        updateGroupInList: (state, action) => {
            const updated = action.payload;
            state.groups = state.groups.map(g => g._id === updated._id ? updated : g);
            if (state.selectedGroup?._id === updated._id) {
                state.selectedGroup = updated;
            }
        },
        removeGroupFromList: (state, action) => {
            const groupId = action.payload;
            state.groups = state.groups.filter(g => g._id !== groupId);
            if (state.selectedGroup?._id === groupId) {
                state.selectedGroup = null;
                state.groupMessages = [];
            }
        }
    }
});

export const {
    setGroups,
    setSelectedGroup,
    setGroupMessages,
    addGroupMessage,
    updateGroupInList,
    removeGroupFromList
} = groupSlice.actions;

export default groupSlice.reducer;

