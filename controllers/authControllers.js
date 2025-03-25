import User from "../models/userModels.js";
import bcrypt from "bcrypt";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        const existingUser = await User.findOne({ email, accountVerified: true });
        if (existingUser) {
            return res.status(400).json({ message: "User already registered" });
        }

        const unverifiedUser = await User.findOne({ email, accountVerified: false });

        if (unverifiedUser) {
            return res.status(400).json({
                message: "An unverified account already exists. Please verify it."
            });
        }

        if (password.length < 8 || password.length > 16) {
            return res.status(400).json({ message: "Password must be between 8 and 16 characters." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        // const verificationCode = generateOTP();
        const verificationCode = await user.generateVerificationCode();
        // user.verificationCode = hashOTP(verificationCode);
        user.verificationCodeExpire = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

        await user.save();

        sendVerificationCode(user.email, verificationCode, res);

    } catch (error) {
        console.error("Error in registration:", error);

        if (error.code === 11000) {
            return res.status(400).json({ message: "User already registered" });
        }

        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({ message: "User not found or OTP expired" });
        }

        console.log("User Verification Code (stored hash):", user.verificationCode);
        console.log("User-entered OTP:", otp);

        if (!user.verificationCode || typeof user.verificationCode !== "string") {
            return res.status(400).json({ message: "OTP is invalid or expired" });
        }
        // Ensure OTP input is a string
        const otpString = otp.toString();

        const isMatch = await bcrypt.compare(otpString, user.verificationCode);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // ✅ Ensure `user` is an instance of User
        if (!(user instanceof User)) {
            return res.status(500).json({ message: "Internal error: Invalid user instance" });
        }

        user.accountVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpire = undefined;
        await user.save();

        res.status(200).json({ message: "OTP Verified" });

    } catch (error) {
        console.error("Error in verifying OTP:", error);
        // res.status(500).json({ error: "Internal Server Error" });
        if (!res.headersSent) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};
