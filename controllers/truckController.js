import cloudinary from 'cloudinary';
import Truck from '../models/Truck.js';
import dotenv from 'dotenv';

dotenv.config();
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const addTruck = async (req, res) => {
    try {
        const { name, description, price, image } = req.body;
        if (!name || !description || !price || !image) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        const result = await cloudinary.v2.uploader.upload(image, {
            folder: 'trucks',
            width: 500,
            height: 500,            
            crop: 'scale',
        });        
        const newTruck = await Truck.create({
            name,
            description,
            price,
            image: {
                public_id: result.public_id,
                url: result.secure_url,
            },
        });
        res.status(201).json(newTruck);        
    } catch (error) {
        console.error("Error in addTruck:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getTrucks = async (req, res) => {
    try {
        const trucks = await Truck.find();
        res.status(200).json(trucks);
    } catch (error) {
        console.error("Error in getTrucks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
       