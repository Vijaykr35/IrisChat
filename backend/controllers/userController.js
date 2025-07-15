import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function register(req, res) {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "password and confirm password are not same" });
        }
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        //profile photo if not working visit :https://ui-avatars.com/
        const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;


        await User.create({
            fullName,
            username,
            password: hashedPassword,
            profilePhoto: (gender === "male" ? maleProfilePhoto : femaleProfilePhoto),
            gender
        });
        return res.status(201).json({ message: "User registered successfully" });

    }

    catch (error) {
        console.log("error in register in controller/userController.js ::", error);
    }
}
export async function login(req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json("All fields are required");
        }
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found", sucess: false });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials", sucess: false });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" }).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePhoto: user.profilePhoto,
            gender: user.gender
        });

    }
    catch (error) {

        console.log(`error in login in usercontroller:: ${error}`);
        return res.status(500).json({ message: "Internal server error", sucess: false });
    }
}
export function logout(req, res) {
    try {

        res.status(200).clearCookie("token", "", { maxAge: 0 }).json({ message: " User Logout successful", sucess: true });

    }
    catch (error) {
        console.log(`error in logout in userController :: ${error}`);
        return res.status(500).json({ message: "Internal server error", sucess: false });

    }
}
export async function getOtherUsers(req, res) {
    try {
        const loggedInUserId = req.id;
        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password"); // ne => not equal to Null and select " -password " for   not showing password
        // console.log(otherUsers);
        return res.status(200).json({ otherUsers });
    }
    catch {
        console.log(`error in getOtherUsers in userController :: ${error}`);
        return res.status(500).json({ message: "Internal server error", sucess: false });
    }
}