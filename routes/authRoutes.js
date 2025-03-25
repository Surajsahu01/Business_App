import express from "express";
import { loginUser, logoutUser, register, verifyOTP } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);
router.get("/logout", logoutUser)

export default router;