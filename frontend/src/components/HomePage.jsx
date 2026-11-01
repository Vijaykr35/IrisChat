import { useState, useEffect } from "react";
import { FiSun, FiMoon, FiLogOut, FiUser, FiMessageSquare, FiUsers, FiX } from "react-icons/fi";
import { BsChatDotsFill, BsStars, BsPalette } from "react-icons/bs";
import ProfileModal from "./ProfileModal.jsx";

import { LiaSearchSolid } from "react-icons/lia";
import OtherUsers from "./otherUsers";
import Message from "./Message.jsx";
import GroupList from "./group/GroupList.jsx";
import GroupChatView from "./group/GroupChatView.jsx";
import AIHistoryList from "./ai/AIHistoryList.jsx";
import AIChatView from "./ai/AIChatView.jsx";

import axios from "axios";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthUser, setSelectedUser } from "../redux/userSlice.js";
import useAuthRedirect from '../hooks/useAuthRedirect';
import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage';

function HomePage() {
  useAuthRedirect();
  useGetRealTimeMessage(); // Active app-wide across all tabs

  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("chats"); // "chats" | "groups" | "ai"
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Escape") {
      setSearch("");
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const q = search.trim().toLowerCase();
      if (!q) return;

      if (activeTab === "chats") {
        const usersList = otherUsers?.otherUsers || (Array.isArray(otherUsers) ? otherUsers : []);
        const matched = usersList.find((user) =>
          user.username.toLowerCase().includes(q) ||
          (user.fullName && user.fullName.toLowerCase().includes(q))
        );
        if (matched) {
          dispatch(setSelectedUser(matched));
          setSearch("");
        }
      }
    }
  };

  // Clean doodle wallpaper toggle: true / false
  const [showDoodles, setShowDoodles] = useState(() => {
    return localStorage.getItem("chaatter_show_doodles") !== "false";
  });

  // Resizable sidebar width (min: 260px, max: 620px)
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem("chaatter_sidebar_width");
    return saved ? Math.max(260, Math.min(620, parseInt(saved, 10))) : 360;
  });
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);

  const { otherUsers, selectedUser } = useSelector((store) => store.user);
  const { selectedGroup } = useSelector((store) => store.group);

  // Mobile layout helpers
  const isSidebarVisibleOnMobile = () => {
    if (activeTab === "chats") return !selectedUser;
    if (activeTab === "groups") return !selectedGroup;
    if (activeTab === "ai") return false; // AI Chat is full-screen on mobile; history is accessed in-chat
    return true;
  };

  const isMainVisibleOnMobile = () => {
    if (activeTab === "chats") return !!selectedUser;
    if (activeTab === "groups") return !!selectedGroup;
    if (activeTab === "ai") return true; // AI Chat is always active
    return true;
  };
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Toggle doodle wallpaper on/off
  const toggleDoodles = () => {
    const nextVal = !showDoodles;
    setShowDoodles(nextVal);
    localStorage.setItem("chaatter_show_doodles", nextVal.toString());
    toast.success(nextVal ? "Doodle Wallpaper: ON" : "Doodle Wallpaper: OFF", { duration: 1500 });
  };

  // Handle sidebar dragging
  const startSidebarResize = (e) => {
    e.preventDefault();
    setIsResizingSidebar(true);
  };

  useEffect(() => {
    if (!isResizingSidebar) return;

    const handleMouseMove = (e) => {
      const newWidth = Math.max(260, Math.min(620, e.clientX));
      setSidebarWidth(newWidth);
      localStorage.setItem("chaatter_sidebar_width", newWidth.toString());
    };

    const handleMouseUp = () => {
      setIsResizingSidebar(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizingSidebar]);

  

  const LogoutHandler = async () => {
    try {
      const BackendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api/v1";
      const res = await axios.get(`${BackendURL}/user/logout`);
      toast.success(res.data.message || "Logout Successful!");
      dispatch(setAuthUser(null));
      navigate("/login");
    } catch (error) {
      console.error(`Error in logout: ${error}`);
    }
  };

  const toggleMode = () => {
    setDarkMode(!darkMode);
  };

  // Clean, natural doodle style
  const getDoodleStyle = () => {
    if (!showDoodles) return { opacity: 0, display: "none" };

    return {
      backgroundImage: "url('/bg-doodle.png')",
      backgroundSize: "360px",
      backgroundRepeat: "repeat",
      opacity: darkMode ? 0.16 : 0.12,
      filter: darkMode ? "contrast(120%) brightness(110%)" : "invert(1) contrast(120%) brightness(95%)",
      mixBlendMode: darkMode ? "screen" : "multiply",
    };
  };

  return (
    <div
      className={`h-screen overflow-hidden ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900"} flex flex-col ${
        isResizingSidebar ? 'select-none' : ''
      }`}
    >
      {/* Header */}
      <header
        className={`px-4 sm:px-6 py-2.5 sm:py-3 justify-between items-center z-30 transition-colors duration-200 ${isMobile && !isSidebarVisibleOnMobile() ? "hidden md:flex" : "flex"} ${darkMode ? 'bg-[#202c33] border-b border-[#313d45] text-[#e9edef]' : 'bg-[#f0f2f5] border-b border-[#d1d7db] text-[#111b21]'}`}
      >
        <div className="flex items-center gap-3 relative group">
          <img src="/iris-logo.jpg" alt="IrisChat Logo" className="w-10 h-10 rounded-xl object-cover shadow-[0_0_15px_rgba(0,168,132,0.3)] transition-transform group-hover:scale-105 border border-[#00a884]/40" />


          <h1 className="text-2xl font-bold tracking-tight">IrisChat</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Doodle Wallpaper Toggle */}
          <button
            onClick={toggleDoodles}
            className={`p-2.5 rounded-full transition-all flex items-center justify-center ${
              showDoodles
                ? (darkMode ? 'bg-[#00a884]/20 text-[#00a884]' : 'bg-[#00a884]/15 text-[#00a884]')
                : (darkMode ? 'hover:bg-[#374248] text-[#8696a0]' : 'hover:bg-[#d1d7db] text-[#8696a0]')
            }`}
            title={`Doodle Wallpaper: ${showDoodles ? "ON" : "OFF"} (Click to toggle)`}
          >
            <BsPalette strokeWidth={0.5} className="text-[20px]" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleMode}
            className={`p-2.5 rounded-full transition-all ${darkMode ? 'hover:bg-[#374248] text-[#aebac1]' : 'hover:bg-[#d1d7db] text-[#54656f]'}`}
            title="Toggle theme"
          >
            {darkMode
              ? <FiSun strokeWidth={2.5} className="text-[22px] hover:text-[#00a884]" />
              : <FiMoon strokeWidth={2.5} className="text-[22px] hover:text-[#00a884]" />
            }
          </button>

          {/* Profile Modal */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className={`p-2.5 rounded-full transition-all ${darkMode ? 'hover:bg-[#374248] text-[#aebac1]' : 'hover:bg-[#d1d7db] text-[#54656f]'}`}
            title="Update Profile"
          >
            <FiUser strokeWidth={2.5} className="text-[22px] hover:text-[#00a884]" />
          </button>

          {/* Logout */}
          <button
            onClick={LogoutHandler}
            className={`p-2.5 ml-1 rounded-full transition-all ${darkMode ? 'hover:bg-[#374248] text-[#aebac1] hover:text-[#f15c6d]' : 'hover:bg-[#d1d7db] text-[#54656f] hover:text-[#f15c6d]'}`}
            title="Log Out"
          >
            <FiLogOut strokeWidth={2.5} className="text-[22px]" />
          </button>
        </div>
      </header>

      {/* Main Section */}
      <div className="flex flex-1 overflow-hidden min-h-0 relative">
        {/* Resizable Sidebar */}
        <aside
          style={isMobile ? { width: "100%", flexShrink: 0 } : { width: `${sidebarWidth}px`, flexShrink: 0 }}
          className={`flex-col z-10 transition-colors duration-300 border-r ${isMobile && !isSidebarVisibleOnMobile() ? "hidden md:flex" : "flex"} ${
            darkMode ? 'bg-[#111b21] border-[#313d45]' : 'bg-white border-gray-200'
          }`}
        >
          {/* Navigation Tabs */}
          <div className={`flex items-center justify-around border-b px-2 py-2 ${darkMode ? 'border-[#313d45] bg-[#202c33]' : 'border-gray-200 bg-[#f0f2f5]'}`}>
            <button
              onClick={() => { setActiveTab("chats"); setSearch(""); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "chats"
                  ? 'bg-[#00a884] text-white shadow-sm'
                  : (darkMode ? 'text-[#aebac1] hover:bg-[#374248]' : 'text-[#54656f] hover:bg-gray-200')
              }`}
            >
              <FiMessageSquare size={15} /> Direct
            </button>

            <button
              onClick={() => { setActiveTab("groups"); setSearch(""); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "groups"
                  ? 'bg-[#00a884] text-white shadow-sm'
                  : (darkMode ? 'text-[#aebac1] hover:bg-[#374248]' : 'text-[#54656f] hover:bg-gray-200')
              }`}
            >
              <FiUsers size={15} /> Groups
            </button>

            <button
              onClick={() => { setActiveTab("ai"); setSearch(""); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "ai"
                  ? 'bg-gradient-to-r from-[#00a884] to-[#25d366] text-white shadow-sm'
                  : (darkMode ? 'text-[#aebac1] hover:bg-[#374248]' : 'text-[#54656f] hover:bg-gray-200')
              }`}
            >
              <BsStars size={15} /> AI Assistant
            </button>
          </div>

          {/* Unified Modern WhatsApp-style Search Bar */}
          <div
            className={`p-2.5 border-b transition-colors ${
              darkMode ? "border-[#313d45] bg-[#111b21]" : "border-gray-200 bg-white"
            }`}
          >
            <div
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border transition-all ${
                isSearchFocused
                  ? (darkMode
                      ? "bg-[#202c33] border-[#00a884] shadow-[0_0_8px_rgba(0,168,132,0.25)]"
                      : "bg-white border-[#00a884] shadow-sm")
                  : (darkMode
                      ? "bg-[#202c33] border-transparent hover:border-[#313d45]"
                      : "bg-[#f0f2f5] border-transparent hover:border-gray-300")
              }`}
            >
              <LiaSearchSolid
                size={18}
                className={`transition-colors flex-shrink-0 ${
                  isSearchFocused
                    ? "text-[#00a884]"
                    : (darkMode ? "text-[#8696a0]" : "text-[#54656f]")
                }`}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onKeyDown={handleSearchKeyDown}
                type="text"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                placeholder={
                  activeTab === "chats"
                    ? "Search or start new chat..."
                    : activeTab === "groups"
                    ? "Search groups..."
                    : "Search AI conversations..."
                }
                className={`w-full bg-transparent border-none focus:outline-none text-xs sm:text-sm ${
                  darkMode
                    ? "text-[#d1d7db] placeholder-[#8696a0]"
                    : "text-[#111b21] placeholder-[#667781]"
                }`}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className={`p-1 rounded-full transition-colors flex-shrink-0 hover:bg-black/10 dark:hover:bg-white/10 ${
                    darkMode ? "text-[#8696a0]" : "text-[#54656f]"
                  }`}
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <FiX size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Sidebar Tab Content */}
          {activeTab === "chats" && <OtherUsers darkMode={darkMode} searchQuery={search} onClearSearch={() => setSearch("")} />}
          {activeTab === "groups" && <GroupList darkMode={darkMode} searchQuery={search} onClearSearch={() => setSearch("")} />}
          {activeTab === "ai" && <AIHistoryList darkMode={darkMode} searchQuery={search} onClearSearch={() => setSearch("")} />}
        </aside>

        {/* Draggable Divider to resize Sidebar & Chatspace */}
        <div
          onMouseDown={startSidebarResize}
          className={`hidden md:flex w-1.5 hover:w-2 transition-all cursor-col-resize group items-center justify-center select-none z-20 flex-shrink-0 ${
            isResizingSidebar
              ? 'bg-[#00a884] w-2 shadow-[0_0_8px_#00a884]'
              : (darkMode ? 'bg-[#202c33] hover:bg-[#00a884]' : 'bg-gray-300 hover:bg-[#00a884]')
          }`}
          title="Drag left or right to resize sidebar & chat space"
        >
          {/* Visual Grip Pill */}
          <div
            className={`w-3.5 h-10 rounded-full flex items-center justify-center gap-0.5 transition-all shadow-md ${
              isResizingSidebar
                ? 'opacity-100 scale-110 bg-[#00a884] text-white'
                : `opacity-0 group-hover:opacity-100 ${
                    darkMode ? 'bg-[#202c33] border border-[#00a884]' : 'bg-white border border-[#00a884]'
                  }`
            }`}
          >
            <div className={`w-0.5 h-3 rounded-full ${isResizingSidebar ? 'bg-white' : 'bg-[#00a884]'}`} />
            <div className={`w-0.5 h-3 rounded-full ${isResizingSidebar ? 'bg-white' : 'bg-[#00a884]'}`} />
          </div>
        </div>

        {/* Chat / Main Area with Clean Natural Doodle Wallpaper */}
        <main
          className={`flex-1 relative transition-colors duration-300 overflow-hidden ${isMobile && !isMainVisibleOnMobile() ? "hidden md:flex" : "flex flex-col"} ${
            darkMode ? 'bg-[#0b141a]' : 'bg-[#efeae2]'
          }`}
        >
          {/* Natural Doodle Wallpaper Layer */}
          <div
            className="absolute inset-0 pointer-events-none z-0 transition-all duration-300"
            style={getDoodleStyle()}
          />

          {/* Active Chat Content */}
          <div className="relative z-10 flex-1 flex flex-col min-h-0 overflow-hidden">
            {activeTab === "chats" && <Message darkMode={darkMode} />}
            {activeTab === "groups" && <GroupChatView darkMode={darkMode} />}
            {activeTab === "ai" && <AIChatView darkMode={darkMode} onBack={() => setActiveTab("chats")} />}
          </div>
        </main>
      </div>

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        darkMode={darkMode}
      />
    </div>
  );
}

export default HomePage;
