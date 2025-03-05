import { config } from "dotenv";
import mongoose, { Mongoose } from "mongoose";

config({path: "./config/config.env"});
const connectDB = async() =>{
    try { 
        await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB connected Successfully");
    }
    catch (error){
        console.log("MongoDB connection error: ", error.message);
        process.exit(1);
    }
};
 export default connectDB;