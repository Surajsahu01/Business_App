import express from "express";
import multer from "multer";
import { authenticateUser } from "../authentication/userAuth.js";
import { addUserService } from "../controllers/userServiceController.js";

const router = express.Router();

const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post("/AddService", upload.array("image",5), authenticateUser, addUserService);

export default router;