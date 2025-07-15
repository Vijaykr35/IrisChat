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


    try {
      const response = await axios.post(
        'http://localhost:8080/api/v1/user/login',
        formData, // Do not stringify
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      navigate("/");
      console.log(response.data);
      dispatch(setAuthUser(response.data)); //data has only user id
      toast.success(response.message || "Login Successful!");

    } catch (error) {
      toast.error(error.response.data.message || "Login Failed!");
    }

    setFormData({ username: "", password: "" });
    // Perform backend registration logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card w-96 bg-white bg-opacity-20 backdrop-blur-lg shadow-xl rounded-lg border border-white border-opacity-30">
        <div className="card-body">
          <h2 className="card-title text-bold text-center pl-[40%] text-black">Login</h2>
          <form onSubmit={handleSubmit}>
            {/* Full Name */}


            {/* Username */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-black">Username</span>
              </label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                className="input input-bordered"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-black">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="input input-bordered"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>


            {/* Submit Button */}
            <div className="p-[10%] cursor-pointer form-control ">
              <button className="cursor-pointer btn btn-primary" type="submit">
                Login
              </button>
            </div>
            <span className="text-black p-10 text-center">Don't  have an account? <Link className="text-primary" to="/register"><span className="cursor-pointer text-blue-600 hover:underline">SignUp</span></Link></span>
          </form>
        </div>
      </div>

    </div>
  );
}

export default Login;
