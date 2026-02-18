import dotenv from "dotenv";
dotenv.config();


import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";

import { configureCloudinary } from "./config/cloudinary.js";
configureCloudinary();



import apiRoutes from "./routes/apiRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";


const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
    })
);

app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI).then(() =>
    console.log("MongoDB Connected")
);

app.use("/api", apiRoutes);
app.use("/admin", adminRoutes);

app.listen(process.env.PORT, () =>
    console.log(`Server running on ${process.env.PORT}`)
);
