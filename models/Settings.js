import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
    aboutLine1: String,
    aboutLine2: String,
    profileImage: String,
    resumeLink: String
});

export default mongoose.model("Settings", settingsSchema);
