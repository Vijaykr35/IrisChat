import express from "express";

const router = express.Router();
import { register, login, logout, getOtherUsers } from "../controllers/userController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);

router.route("/").get(isAuthenticated, getOtherUsers);

export default router;