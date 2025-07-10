import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv';

dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dvwndmmur';
const apiKey = process.env.CLOUDINARY_API_KEY || '941449398598616';
const apiSecret = process.env.CLOUDINARY_API_SECRET || 'h9VKzji4y8XnfXMh8bVGPSFvPuI';

if (!cloudName || !apiKey || !apiSecret) {
    console.error('Missing Cloudinary configuration. Please check your environment variables.');
    process.exit(1);
}

// Configure Cloudinary
cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true // Force HTTPS
});

console.log('Cloudinary configured with cloud name:', cloudName);

export default cloudinary;