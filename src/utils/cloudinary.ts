import { v2 as cloudinary, UploadApiResponse, TransformationOptions } from 'cloudinary';

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
const uploadImageToCloudinary = async (
  filePath: string,
  folder: string = 'posts',
  options: { [key: string]: any } = {}
): Promise<string> => {
  try {
    const result: UploadApiResponse = await cloudinary.uploader.upload(filePath, {
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
const generateThumbnailUrl = (
  publicId: string,
  options: TransformationOptions | TransformationOptions[] = []
): string => {
  // Ensure options is an array or an empty array
  const transformations = Array.isArray(options) ? options : [options];
  
  return cloudinary.url(publicId, {
    transformation: [
      { width: 400, height: 300, crop: 'limit' },
      ...transformations,
    ],
  });
};

/**
 * Deletes an image from Cloudinary based on its public ID.
 * @param {string} publicId - The public ID of the image to be deleted.
 * @returns {Promise<void>} - A promise that resolves when the image is deleted.
 * @throws {Error} - If deletion fails.
 */
const deleteImageFromCloudinary = async (
  publicId: string
): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`Image with public ID ${publicId} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw new Error('Image deletion failed');
  }
};

export { uploadImageToCloudinary, generateThumbnailUrl, deleteImageFromCloudinary };
