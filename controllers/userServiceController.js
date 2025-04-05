import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import UserService from '../models/userServiceModel.js';
import User from '../models/userModels.js';

dotenv.config();
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})

export const addUserService = async (req, res) => {
    try {
        const { serviceType, truckName, model, totalTyres } = req.body;

        const userId = req.userId; // Assuming you have the user ID from the authentication middleware
        const userName = await User.findById(userId); // Fetch the user name from the database
        
        if (!req.files || req.files.length === 0) {
            console.log("Files not found in request:", req.files);
            return res.status(400).json({ message: "Please upload at least one image" });
        }

        if (!serviceType || !truckName || !model || !totalTyres) {
            return res.status(400).json({ message: "Please enter all fields" });
        }
         // Upload images to Cloudinary
         const uploadedImages = await Promise.all(
            req.files.map(file =>
                cloudinary.v2.uploader.upload(file.path, {
                    folder: "UserTrucks",
                    width: 500,
                    height: 500,
                    crop: "scale",
                })
            )
        );
        // Prepare images array
        const images = uploadedImages.map(img => ({
            public_id: img.public_id,
            url: img.secure_url
        }));

        const newUserService = await UserService.create({
            userId,
            userName: userName.name, // Assuming you want to save the user's name
            serviceType,
            truckName,
            model,
            totalTyres,
            image: images[0], // Assuming you want to save the first image as the main image
            
        });

        res.status(201).json({message: "user select service successfully", newUserService});
    } catch (error) {
        console.error("Error in addUserService:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}