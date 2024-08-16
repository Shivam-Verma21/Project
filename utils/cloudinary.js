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
    if (!localFilePath) return alert("File not found!!");
    //upload the file
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("File has uploaded successfully!!");
    console.log(result, result.url);
    return result;
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove locally saved temporary file as upload failed
    return null;
  }
};

export { uploadOnCloudinary };
