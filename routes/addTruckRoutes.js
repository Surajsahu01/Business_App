import express from "express";
import { addTruck, getTrucks, getTruckById, updateTruck } from "../controllers/truckController.js";
import multer from "multer";
import { authenticateUser, authorization } from "../authentication/userAuth.js";

const router = express.Router();

const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post("/AddTruck",upload.single("image"), authenticateUser, authorization("admin"), addTruck);
router.get("/getTrucks", getTrucks);
router.get("/getTrucks/:id", getTruckById);
router.put("/updateTruck/:id",upload.single("image"), authenticateUser, authorization("admin"), updateTruck);

export default router;