import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    accountVerified:{
        type: Boolean,
        default: false,
    },
    serviceBorrowed: [
        {
            serviceId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Service",
            },
            serviceName: {
                type: String,
                required: true,
            },
            borrowedDate: {
                type: Date,
                default: Date.now(),
            },
        },    
    ],
    avatar: {
        publice_id: String,
        url: String,
    },
    verificationCode: {
        type: String,  // ✅ Change from Number to String
    },
    verificationCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date, 
},
{
    timestamps: true,
}
);

UserSchema.methods.generateVerificationCode = async function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
    const salt = await bcrypt.genSalt(10);
    this.verificationCode = await bcrypt.hash(otp, salt);
    this.verificationCodeExpire = Date.now() + 10 * 60 * 1000;
    return otp;  
};

const User = mongoose.model("User", UserSchema);
export default User;