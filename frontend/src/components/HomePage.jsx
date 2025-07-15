import React, { useState } from "react";
import { FaClosedCaptioning, FaSun } from "react-icons/fa";
import { CiDark } from "react-icons/ci";
import { FaRocketchat } from "react-icons/fa";
import { LiaSearchSolid } from "react-icons/lia";
import OtherUsers from "./otherUsers";
import Message from "./Message.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthUser, setOtherUsers, setSelectedUser } from "../redux/userSlice.js";
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
      const res = await axios.get("http://localhost:8080/api/v1/user/logout");
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
      className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900"
        } flex flex-col`}
    >
      {/* Header */}
      <header
        className={`p-2 flex justify-between items-center shadow-md  bg-gray-800
          `}
      >
        <img
          className="w-12 h-12  object-cover"
          src="/chaatter.png"
          alt="img"
        />

        <h1 className=" text-xl font-bold text-white  text-center ">Chaatter </h1>


        <div className="flex items-center gap-4">
          <button
            onClick={toggleMode}
            className={`p-3 rounded-full  h-10 w-10 flex items-center justify-center shadow-md transition-all duration-300
    ${darkMode
                ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
                : "bg-white hover:bg-gray-200 text-gray-800 border"
              }`}
          >
            {darkMode
              ? <FaSun className="text-yellow-400 text-2xl" />
              : <CiDark className="text-gray-800 text-2xl" />
            }
          </button>


          <button
            onClick={LogoutHandler}
            className="px-4 py-2 rounded-lg shadow-sm bg-red-800 hover:bg-red-700"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main Section */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`w-1/4 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-200 border-gray-300"
            } shadow-lg border-r`}
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
              className={`w-full p-3 rounded-full border focus:outline-none focus:ring-2 ${darkMode
                ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-teal-500"
                : "bg-gray-100 text-gray-900 border-gray-400 focus:ring-blue-500"
                }`}
            />
            <button
              onClick={searchSubmitHandler}
              className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 text-white"
            >
              <LiaSearchSolid size={20} />
            </button>
          </div>

          {/* Chat List */}
          <OtherUsers darkMode={darkMode} />
        </aside>

        {/* Chat Area */}

        <main className={`flex-1 flex flex-col ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
          <Message darkMode={darkMode} />
        </main>
      </div>

      <SendMessage darkMode={darkMode} />
    </div>
  );
}

export default HomePage;
