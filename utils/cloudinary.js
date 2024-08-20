import { v2 as cloudinary } from 'cloudinary';
import { uploadImage, generateThumbnail } from '../utils/cloudinary.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
  secure: true,
});

/**
 * Uploads an image to Cloudinary and returns the URL of the uploaded image.
 * @param {string} filePath - The path of the file to upload.
 * @param {string} folder - The folder where the image should be uploaded.
 * @param {object} options - Additional options for Cloudinary upload.
 * @returns {Promise<string>} - The URL of the uploaded image.
 */
const uploadImageToCloudinary = async (filePath, folder = 'posts', options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      ...options,
    });
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Image upload failed');
  }
};

/**
 * Generates a thumbnail for an image stored in Cloudinary.
 * @param {string} publicId - The public ID of the image in Cloudinary.
 * @param {object} options - Transformation options for the thumbnail.
 * @returns {string} - The URL of the thumbnail.
 */
const generateThumbnailUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, {
    transformation: [
      { width: 200, height: 150, crop: 'limit' },
      ...options,
    ],
  });
};

export { uploadImageToCloudinary, generateThumbnailUrl };
