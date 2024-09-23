import { TransformationOptions } from "cloudinary";
/**
 * Uploads an image to Cloudinary and returns the URL of the uploaded image.
 * @param {string} filePath - The path of the file to upload.
 * @param {string} folder - The folder where the image should be uploaded.
 * @param {object} options - Additional options for Cloudinary upload.
 * @returns {Promise<string>} - The URL of the uploaded image.
 */
declare const uploadImageToCloudinary: (filePath: string, folder?: string, options?: {
    [key: string]: any;
}) => Promise<string>;
/**
 * Generates a thumbnail for an image stored in Cloudinary.
 * @param {string} publicId - The public ID of the image in Cloudinary.
 * @param {object} options - Transformation options for the thumbnail.
 * @returns {string} - The URL of the thumbnail.
 */
declare const generateThumbnailUrl: (publicId: string, options?: TransformationOptions | TransformationOptions[]) => string;
/**
 * Deletes an image from Cloudinary based on its public ID.
 * @param {string} publicId - The public ID of the image to be deleted.
 * @returns {Promise<void>} - A promise that resolves when the image is deleted.
 * @throws {Error} - If deletion fails.
 */
declare const deleteImageFromCloudinary: (publicId: string) => Promise<void>;
export { uploadImageToCloudinary, generateThumbnailUrl, deleteImageFromCloudinary, };
