import mongoose from "mongoose";

const TruckSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
    },
    modelNumber: {
        type: String,
        required: true,
    },
    description: {
        type: String,
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
    localImage: {
        type: String,
        
    },
},
{
    timestamps: true,
}
);

const Truck = mongoose.model("Truck", TruckSchema);
export default Truck;