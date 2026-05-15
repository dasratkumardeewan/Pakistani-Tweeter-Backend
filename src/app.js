import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static("public"));
app.use(cookieParser());


// Routes Import
import userRouter from './routes/user.route.js' 

// Routes Declaration
app.use("/api/v1/users", userRouter);

export { app };
