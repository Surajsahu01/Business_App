import nodeMailer from "nodemailer";
import { config } from "dotenv";

config({path: "./config/config.env"});


export const sendEmail = async ({email, subject, message}) =>{
    // console.log(
    //     "SMTP Credentials: ",{
    //         host: process.env.SMTP_HOST,
    //         service: process.env.SMTP_SERVICE,
    //         port: process.env.SMTP_PORT,
    //         user: process.env.SMTP_MAIL,
    //         pass: process.env.SMTP_PASSWORD ? "Loded" : "Missing"
            
          
    //     }
    // );
    // console.log("Recipient Email:", email);
    if (!email) {
        throw new Error("Recipient email is missing!");
    }
    
    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        service: process.env.SMTP_SERVICE,
        port: process.env.SMTP_PORT,
        
        
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });
    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: subject || "No Subject Provided",
        html: message || "<p>No Message Provided</p>"
    };
    // await transporter.sentEmail(mailOptions);
    // await transporter.sendMail(mailOptions);
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}