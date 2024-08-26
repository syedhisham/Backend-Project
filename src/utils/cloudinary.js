import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // console.log("File Uploaded to Cloudinary ", response.url);
    fs.unlinkSync(localFilePath);
    
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};
const deleteFromCloudinary = async (url) => {
  try {
    // Extract the public ID from the URL
    const publicId = url.split('/').pop().split('.')[0];

    // Delete the image using the public ID
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw new Error("Failed to delete the old avatar from Cloudinary.");
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
