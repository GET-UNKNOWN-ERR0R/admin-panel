
import mongoose from "mongoose";

export default mongoose.model(
    "Project",
    new mongoose.Schema({
        title: String,
        description: String,
        image: String,
        tech: [String],
        github: String,
        live: String,
        featured: Boolean
    })
);
