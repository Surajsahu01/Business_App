import { config } from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";



export const app = express();

config({path: "./config/config.env"});


//  Add Mideleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
