
import mongoose from "mongoose";

export default mongoose.model(
    "Certification",
    new mongoose.Schema({
        title: String,
        provider: String,
        year: String,
        image: String
    })
);
