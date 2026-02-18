
import mongoose from "mongoose";

export default mongoose.model(
    "Admin",
    new mongoose.Schema({
        email: String,
        password: String
    })
);
