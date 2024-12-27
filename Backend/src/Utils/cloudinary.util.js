import cloudinary from "cloudinary";
import fs from "fs";

// import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.Cloudinary_Cloud_Name,
  api_key: process.env.Cloudinary_api_key,
  api_secret: process.env.Cloudinary_api_secret,
});
export const uploadOnCloudinary = async (localfilepath) => {
  try {
    if (!localfilepath) {
      console.log("Local File Path is: ", localfilepath);
      return null;
    }
    const response = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto",
    });
    console.log("file is uploaded successfully on cloudinary", response.url);
    fs.unlinkSync(localfilepath);
    return response.url;
  } catch (error) {
    console.log("Hello", error);
    // fs.unlinkSync(localfilepath) //remove locally saved temp file as upload failed
    return null;
  }
};
