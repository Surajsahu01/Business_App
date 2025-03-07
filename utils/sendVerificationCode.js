import e from "express";
import { generateVerificationOtpEmailTemplate } from "./emailTemplate.js";
import { sendEmail } from "./sentEmail.js";



export const sendVerificationCode = async (email, verificationCode, res) =>{
    try {
        // Validate email format
        if (!email || typeof email !== "string" || !email.includes("@")) {
            console.error("Invalid recipient email:", email);
            return res.status(400).json({ message: "Invalid email address" });
        }

        const message = generateVerificationOtpEmailTemplate(verificationCode);
        const emailSent = await sendEmail({
            email,
            subject: "Verification Code(Jai Maa Bhawani Body Makers)",
            message,
        });
        console.log("Verification code sent successfully",emailSent);
        

        res.status(200).json({message: "verification code sent successfully"});
        
    } catch (error) {
        console.log("Error sending verification email:", error);
        res.status(500).json({message: "verification code not sent"});
        
    }

}