import User from "../models/userModels.js";
import bcrypt from "bcrypt";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import { generateToken } from "../authentication/userAuth.js";
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

        if (password.length < 8 || password.length > 16) {
            return res.status(400).json({ message: "Password must be between 8 and 16 characters." });
        }

        let user = await User.findOne({ email, accountVerified: false });
        
        if (user) {
            // Check if OTP was requested less than 5 minutes ago
            if (user.verificationCodeExpire && user.verificationCodeExpire > Date.now() - 5 * 60 * 1000) {
                return res.status(400).json({ message: "Please wait 5 minutes before requesting a new OTP" });
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            user = await User.create({ name, email, password: hashedPassword });
        }

        // const verificationCode = generateOTP();
        const verificationCode = await user.generateVerificationCode();
        // user.verificationCode = hashOTP(verificationCode);
        user.verificationCodeExpire = Date.now() + 10 * 60 * 1000; 
        await user.save();

        sendVerificationCode(user.email, verificationCode, res);

    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: "Please enter all fields" });
        }


        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found or OTP expired" });
        }

        // console.log("User Verification Code (stored hash):", user.verificationCode);
        // console.log("User-entered OTP:", otp);

        if (!user.verificationCode || typeof user.verificationCode !== "string") {
            return res.status(400).json({ message: "OTP is invalid or expired" });
        }


        const isMatch = await bcrypt.compare(otp.toString(), user.verificationCode);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // ✅ Ensure `user` is an instance of User
        // if (!(user instanceof User)) {
        //     return res.status(500).json({ message: "Internal error: Invalid user instance" });
        // }

        user.accountVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpire = undefined;
        await user.save();

        const token = generateToken(user);
        res.cookie("token", token, { httpOnly: true, secure: true });

        res.status(200).json({ message: "OTP Verified", token });

    } catch (error) {
        console.error("Error in verifying OTP:", error);
        res.status(500).json({ error: "Internal Server Error" });
        // if (!res.headersSent) {
        //     return res.status(500).json({ message: "Internal server error" });
        // }
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user || !user.accountVerified) {
            return res.status(400).json({ message: "This email is not registered" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password is incorrect" });
        }

        const token = generateToken(user);
        res.cookie("token", token, { httpOnly: true, secure: true });
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in logout:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};