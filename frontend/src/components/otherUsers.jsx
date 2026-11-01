import React from 'react';
import OtherUser from './otherUser';
import useGetOtherUsers from '../hooks/useGetOtherUsers';
import { useSelector } from 'react-redux';
import { LiaSearchSolid } from 'react-icons/lia';

function OtherUsers({ darkMode, searchQuery = "", onClearSearch }) {
    useGetOtherUsers();

    const rawData = useSelector((store) => store.user.otherUsers);
    const usersList = rawData?.otherUsers || (Array.isArray(rawData) ? rawData : []);

    const query = searchQuery.trim().toLowerCase();
    const filteredUsers = query
        ? usersList.filter((user) => {
            const username = user?.username?.toLowerCase() || "";
            const fullName = user?.fullName?.toLowerCase() || "";
            return username.includes(query) || fullName.includes(query);
        })
        : usersList;

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search Result Counter Bar */}
            {query ? (
                <div
                    key="search-counter-bar"
                    className={`px-3 py-1.5 text-[11px] font-medium border-b flex items-center justify-between transition-colors ${
                        darkMode
                            ? 'bg-[#182229] border-[#313d45] text-[#8696a0]'
                            : 'bg-[#f0f2f5] border-gray-200 text-[#54656f]'
                    }`}
                >
                    <span>
                        {filteredUsers.length} {filteredUsers.length === 1 ? 'contact' : 'contacts'} found
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

            {/* List or Empty State */}
            <div className="flex-1 overflow-y-auto">
                {query && filteredUsers.length === 0 ? (
                    <div
                        key="empty-search-state"
                        className="flex flex-col items-center justify-center py-12 px-4 text-center select-none"
                    >
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                                darkMode ? 'bg-[#202c33] text-[#8696a0]' : 'bg-gray-100 text-gray-400'
                            }`}
                        >
                            <LiaSearchSolid size={24} />
                        </div>
                        <p className="text-sm font-semibold mb-1">
                            <span>No contacts found</span>
                        </p>
                        <p
                            className={`text-xs max-w-[220px] mb-3 ${
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
                ) : (
                    <div key="users-list-container">
                        {filteredUsers.map((user) => (
                            <OtherUser
                                key={user._id}
                                user={user}
                                darkMode={darkMode}
                                searchQuery={query}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default OtherUsers;
