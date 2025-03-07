import User from "../models/userModels.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";

export const register = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                message: "Please enter all fields"
            })
        }
        const isRegistered = await User.findOne({email, accountVerified:true})
        if(isRegistered){
            return res.ststus(400).JSON({message: "User Already Registered"})
        }
        const resgistraionAttempt = await User.find({
            email,
            accountVerified: false,
        });
        if(resgistraionAttempt.length >= 5){
            return res.ststus(400).JSON({
                message: "Too many registration attempts, please try again later" 
            }
        );

        }
        if (password.length <8 || password.length > 16){
            return res.status(400).JSON({
                message: "Password must be Between 8 and 16 Characters."
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email,
            password: hashedPassword,

    })
    const verificationCode = await user.generateVerificationCode();
    await user.save();
    sendVerificationCode(email, verificationCode, res);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
        
    }
}