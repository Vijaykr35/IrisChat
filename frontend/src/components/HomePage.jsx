import  { useState } from "react";
import { FiSun, FiMoon, FiLogOut } from "react-icons/fi";
import { BsChatDotsFill } from "react-icons/bs";

import { LiaSearchSolid } from "react-icons/lia";
import OtherUsers from "./otherUsers";
import Message from "./Message.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthUser, setSelectedUser } from "../redux/userSlice.js";
import SendMessage from './sendMessage.jsx';
import useAuthRedirect from '../hooks/useAuthRedirect';

function HomePage() {
  useAuthRedirect();
  const [darkMode, setDarkMode] = useState(true);
  const [search, setSearch] = useState("");
  const { otherUsers } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchSubmitHandler = (e) => {
    e.preventDefault();
    console.log(`otherUsers from home page line No 22: ${otherUsers}`);
    console.log(`search from home page line No 23: ${search}`);
    const conversationUser = (otherUsers.otherUsers.find((user) => user.username.toLowerCase().includes(search.toLowerCase())));

    // const conversationUser = otherUsers?.otherUsers?.find((user) => user.username.toLowerCase().includes(search.toLowerCase()));
    if (conversationUser) {
      dispatch(setSelectedUser(conversationUser));
      setSearch("");
    } else {
      toast.error("User not found!");
    }
  }

  const LogoutHandler = async () => {
    try {
      const BackendURL = "http://localhost:8080/api/v1";
      const res = await axios.get(`${BackendURL}/user/logout`);
      toast.success(res.data.message || "Logout Successful!");
      dispatch(setAuthUser(null));
      navigate("/login");
    } catch (error) {
      console.log(`Error in logout: ${error}`);
    }
  };

  const toggleMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`h-screen overflow-hidden ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900"
        } flex flex-col`}
    >
      {/* Header */}
      <header
        className={`px-6 py-3 flex justify-between items-center ${darkMode ? 'bg-[#202c33] border-b border-[#313d45] text-[#e9edef]' : 'bg-[#f0f2f5] border-b border-[#d1d7db] text-[#111b21]'}`}
      >
        <div className="flex items-center gap-3 relative group">
          <div className="w-10 h-10 bg-[#00a884] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,168,132,0.3)] transition-transform group-hover:scale-105">
            <BsChatDotsFill className="text-white text-xl" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Chaatter</h1>
        </div>

        <div className="flex items-center gap-2">
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
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Sidebar */}
        <aside
          className={`w-[30%] min-w-[300px] border-r border-[#313d45] flex flex-col z-10 transition-colors duration-300 ${darkMode ? 'bg-[#111b21]' : 'bg-white'}`}
        >
          {/* Search Bar */}
          <div
            className={`p-4 border-b flex flex-row items-center gap-2 ${darkMode ? "border-gray-700" : "border-gray-300"
              }`}
          >
            <input
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search Users..."
              className={`w-full p-2 pl-4 rounded-lg border-none focus:outline-none focus:ring-1 focus:ring-[#00a884] ${darkMode ? 'bg-[#202c33] text-[#d1d7db] placeholder-[#8696a0]' : 'bg-[#f0f2f5] text-[#111b21] placeholder-[#667781]'} transition-all`}
            />
            <button
              onClick={searchSubmitHandler}
              className={`p-2 ml-2 rounded-full transition-colors ${darkMode ? 'text-[#aebac1] hover:bg-[#202c33]' : 'text-[#54656f] hover:bg-[#e9edef]'}`}
            >
              <LiaSearchSolid size={20} />
            </button>
          </div>

          {/* Chat List */}
          <OtherUsers darkMode={darkMode} />
        </aside>

        {/* Chat Area */}

        <main className={`flex-1 flex flex-col relative transition-colors duration-300 overflow-hidden ${darkMode ? 'bg-[#0b141a]' : 'bg-[#efeae2]'}`}>
          <Message darkMode={darkMode} />
        </main>
      </div>
    </div>
  );
}

export default HomePage;
