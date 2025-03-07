
import mongoose from "mongoose";

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
    verificationCode: Number,
    verificationCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date, 
},
{
    timestamps: true,
}
);
UserSchema.methods.generateVerificationCode = function () {
    const generateRandomDigitNumber = () => {
        const firstDigit = Math.floor(Math.random() * 9) + 1;
        const remanigDigits = Math.floor(Math.random() * 10000).toString().padStart(4, 0);

        return parseInt(firstDigit + remanigDigits);
    }

    this.verificationCode = generateRandomDigitNumber();
    this.verificationCodeExpire = Date.now() + 10 * 60 * 1000;
    return this.verificationCode;
 }

const User = mongoose.model("User", UserSchema);
export default User;