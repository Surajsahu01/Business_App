import express from "express";
import { register, verifyOTP } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);

export default router;