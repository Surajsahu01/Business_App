import mongoose from "mongoose";

const UserServiceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    userName: {
        type: String,
        required: true,
    },

    serviceType: {
        type: String,
        required: true,
    },
    truckName: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    totalTyres:{
        type: Number,
        required: true,
    },
    image: {
        public_id:{
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true, 
        },
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    localImage: {
        type: String,
        
    },
},
{
    timestamps: true,
}
);

const UserService = mongoose.model("UserService", UserServiceSchema);
export default UserService;