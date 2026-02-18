import { v2 as cloudinary } from "cloudinary";

let isConfigured = false;

export const configureCloudinary = () => {
    if (isConfigured) return;

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET
    });

    console.log("✅ Cloudinary Configured:", {
        cloud: process.env.CLOUDINARY_CLOUD,
        key: process.env.CLOUDINARY_KEY ? "LOADED" : "MISSING",
        secret: process.env.CLOUDINARY_SECRET ? "LOADED" : "MISSING"
    });

    isConfigured = true;
};


export const uploadToCloudinary = async (file, folder) => {
    if (!file) throw new Error("No file received");

    const isPdf = file.mimetype === "application/pdf";

    const result = await cloudinary.uploader.upload(file.path, {
        folder,
        resource_type: isPdf ? "raw" : "image",
        use_filename: true,
        unique_filename: false
    });

    return result.secure_url;
};
