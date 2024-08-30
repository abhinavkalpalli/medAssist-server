import axios from "axios";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data'; // Import form-data package

dotenv.config();

export const uploadImageToCloudinary = async (imagePath: string): Promise<string> => {
  const cloud_name = process.env.CLOUDINARY_NAME;
  const url = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(imagePath)); // Use fs.createReadStream to read the file
    formData.append("upload_preset", "mzydeesi");

    // Axios request with proper headers for FormData
    const response = await axios.post<{ secure_url: string }>(url, formData, {
      headers: {
        ...formData.getHeaders(), // Include form-data headers
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};

export const uploadVoiceMessageToCloudinary = async (voicePath: string): Promise<string> => {
  const cloud_name = process.env.CLOUDINARY_NAME;
  const url = `https://api.cloudinary.com/v1_1/${cloud_name}/video/upload`;

  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(voicePath)); // Use fs.createReadStream to read the file
    formData.append("upload_preset", "mzydeesi");

    // Axios request with proper headers for FormData
    const response = await axios.post<{ secure_url: string }>(url, formData, {
      headers: {
        ...formData.getHeaders(), // Include form-data headers
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading voice message to Cloudinary:", error);
    throw error;
  }
};
