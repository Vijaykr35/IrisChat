import  { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "male", // Default gender
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("FormData before submission:", formData);
    // Validate formData
    if (!formData.fullName || !formData.username || !formData.password || !formData.gender) {

      toast.error("All fields are required!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {


      const response = await axios.post(
        'http://localhost:8080/api/v1/user/register',
        formData, // Do not stringify
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      navigate("/login");
      console.log(response.message);


      toast.success(Response.message || "Registration Successful!");

      console.log("Response:", response.data);

    } catch (error) {
      toast.error(error.response.data.message || "Registration Failed!");
      if (error.response) {
        console.error("Error Response Data:", error.response.data);
      } else {
        console.error("Axios Error:", error.message);
      }
    }

    setFormData({
      fullName: "",
      username: "",
      password: "",
      confirmPassword: "",
      gender: "male", // Reset gender
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r ">
      <div className="card w-96 bg-white bg-opacity-10 backdrop-blur-md shadow-xl rounded-lg border border-white border-opacity-30">
        <div className="card-body">
          <h2 className="card-title text-center pl-[40%] text-black text-2xl font-bold">SignUp</h2>
          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-black">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                className="input input-bordered bg-gray-800 text-white border-gray-700"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Username */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-black">Username</span>
              </label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                className="input input-bordered bg-gray-800 text-white border-gray-700"
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
                className="input input-bordered bg-gray-800 text-white border-gray-700"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-black">Confirm Password</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                className="input input-bordered bg-gray-800 text-white border-gray-700"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {/* Gender */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-black">Gender</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    className="radio radio-primary"
                    checked={formData.gender === "male"}
                    onChange={handleChange}
                  />
                  <span className="ml-2 text-black">Male</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    className="radio radio-primary"
                    checked={formData.gender === "female"}
                    onChange={handleChange}
                  />
                  <span className="ml-2 text-black">Female</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button className="btn btn-primary w-full ">SignUp</button>
            </div>

            {/* Already have an account */}
            <span className="block text-center text-black mt-4">
              Already have an account?
              <Link className="text-blue-300 hover:underline" to="/login">
                <span className="text-blue-600 hover:underline"> Login</span>
              </Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
