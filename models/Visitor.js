import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
    {
        ip: String,
        country: String,
        city: String,
        device: String,
        browser: String
    },
    { timestamps: true }
);

export default mongoose.model("Visitor", visitorSchema);
