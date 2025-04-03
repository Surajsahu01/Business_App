import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import Truck from '../models/truckModel.js';

dotenv.config();
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})

export const addTruck = async (req, res) => {
    try {
        const { companyName, modelNumber, description} = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Please upload an image" });
        }

        if (!companyName || !modelNumber || !description) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        // Ensure price is a number
        // const truckPrice = parseFloat(price);
        // if (isNaN(truckPrice)) {
        //     return res.status(400).json({ message: "Price must be a valid number" });
        // }

        const result = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: 'trucks',
            width: 500,
            height: 500,            
            crop: 'scale',
            quality: 80,
        });        
        const newTruck = await Truck.create({
            companyName,
            modelNumber,
            description,
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
        const trucks = await Truck.find().select("companyName description modelNumber image");

        if (trucks.length === 0) {
            return res.status(404).json({ message: "No trucks found" });
        }
        res.status(200).json(trucks);
    } catch (error) {
        console.error("Error in getTrucks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getTruckById = async (req, res) =>{
    const truckId = req.params.id;
    try {
        const truck = await Truck.findById(truckId)
        if (!truck) {
            return res.status(404).json({ message: "Truck not found" });
        }
        res.status(200).json(truck);
        
    } catch (error) {
        console.error("Error in getTruckById:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}
    
export const updateTruck = async (req, res) => {
    const truckId = req.params.id;
    const { companyName, modelNumber, description } = req.body;
    if (!companyName || !modelNumber || !description) {
        return res.status(400).json({ message: "Please enter all fields" });
    }
    try {
        const truck = await Truck.findById(truckId);
        if (!truck) {
            return res.status(404).json({ message: "Truck not found" });
        }
        truck.companyName = companyName;
        truck.modelNumber = modelNumber;
        truck.description = description;
        if (req.file) {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'trucks',
                width: 500,
                height: 500,            
                crop: 'scale',
                quality: 80,
            });
            truck.image.public_id = result.public_id;
            truck.image.url = result.secure_url;
        }
        await truck.save();
        res.status(200).json({message: "Truck updated successfully" , truck});
        
    } catch (error) {
        console.error("Error in updateTruck:", error);
        res.status(500).json({ error: "Internal server error" });
        
    }
}
