import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { setAuthUser } from "../redux/userSlice";
function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();



    const BackendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api/v1";
    try {
      const response = await axios.post(
        `${BackendURL}/user/login`,
        formData, // Do not stringify
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      navigate("/chat");
      
      dispatch(setAuthUser(response.data)); //data has only user id
      toast.success(response.message || "Login Successful!");

    } catch (error) {
      toast.error(error.response.data.message || "Login Failed!");
    }

    setFormData({ username: "", password: "" });
    // Perform backend registration logic here
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#111b21] p-4 font-sans text-[#e9edef] overflow-hidden">
      {/* Repeating Doodle Background */}
      <div className="absolute inset-0 z-0 opacity-[0.15]" style={{ backgroundImage: "url('/bg-doodle.png')", backgroundSize: "400px", backgroundRepeat: "repeat" }}></div>

      <div className="relative z-10 w-full max-w-[380px] bg-[#202c33]/80 backdrop-blur-xl shadow-2xl rounded-xl overflow-hidden border border-white/5">

        <div className="p-6 pb-5 border-b border-white/10 flex items-center gap-3 justify-center">
          <img src="/iris-logo.jpg" alt="IrisChat" className="w-10 h-10 rounded-xl object-cover shadow-lg border border-[#00a884]/40" />


          <h2 className="text-xl font-bold tracking-tight">Login to IrisChat</h2>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#8696a0]">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                className="w-full p-2.5 rounded-lg border-none bg-[#2a3942] text-[#d1d7db] placeholder-[#8696a0] focus:outline-none focus:ring-2 focus:ring-[#00a884] transition-all text-sm"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#8696a0]">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full p-2.5 rounded-lg border-none bg-[#2a3942] text-[#d1d7db] placeholder-[#8696a0] focus:outline-none focus:ring-2 focus:ring-[#00a884] transition-all text-sm"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="w-full py-2.5 mt-2 rounded-lg bg-[#00a884] hover:bg-[#008f6f] text-white font-medium tracking-wide transition-colors">
              Log In
            </button>

            <div className="text-center mt-1 text-sm text-[#8696a0]">
              Don't have an account? <Link className="text-[#00a884] hover:underline hover:text-[#00c29a] transition-colors" to="/register">Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
