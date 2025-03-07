import { generateVerificationOtpEmailTemplate } from "./emailTemplate.js";
import { sentEmail } from "./sentEmail.js";

export const sendVerificationCode = async ( verificationCode, email, res) =>{
    try {
        const message = generateVerificationOtpEmailTemplate(verificationCode);
        sentEmail({
            email,
            subject: "Verification Code(Jai Maa Bhawani Body Makers)",
            message,
        });
        res.status(400).json({message: "verification code sent successfully"});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "verification code not sent"});
        
    }

}