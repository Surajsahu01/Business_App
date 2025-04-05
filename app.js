import { config } from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authrouter from "./routes/authRoutes.js";
import addTruckRoutes from "./routes/addTruckRoutes.js";
import userServiceRoutes from "./routes/userServiceRoutes.js";



export const app = express();

config({path: "./config/config.env"});

app.use(cors())


//  Add Mideleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

app.use("/api/v1", authrouter);
app.use("/api/v1/trucks", addTruckRoutes);
app.use("/api/v1/userService", userServiceRoutes);
