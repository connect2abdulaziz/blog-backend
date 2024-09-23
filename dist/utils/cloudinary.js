"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImageFromCloudinary = exports.generateThumbnailUrl = exports.uploadImageToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const app_config_1 = require("../config/app.config");
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: app_config_1.APP_CONFIG.CLOUDINARY_CLOUD_NAME,
    api_key: app_config_1.APP_CONFIG.CLOUDINARY_API_KEY,
    api_secret: app_config_1.APP_CONFIG.CLOUDINARY_API_SECRET_KEY,
    secure: true,
});
/**
 * Uploads an image to Cloudinary and returns the URL of the uploaded image.
 * @param {string} filePath - The path of the file to upload.
 * @param {string} folder - The folder where the image should be uploaded.
 * @param {object} options - Additional options for Cloudinary upload.
 * @returns {Promise<string>} - The URL of the uploaded image.
 */
const uploadImageToCloudinary = (filePath_1, ...args_1) => __awaiter(void 0, [filePath_1, ...args_1], void 0, function* (filePath, folder = "posts", options = {}) {
    try {
        const result = yield cloudinary_1.v2.uploader.upload(filePath, Object.assign({ folder }, options));
        return result.secure_url;
    }
    catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw new Error("Image upload failed");
    }
});
exports.uploadImageToCloudinary = uploadImageToCloudinary;
/**
 * Generates a thumbnail for an image stored in Cloudinary.
 * @param {string} publicId - The public ID of the image in Cloudinary.
 * @param {object} options - Transformation options for the thumbnail.
 * @returns {string} - The URL of the thumbnail.
 */
const generateThumbnailUrl = (publicId, options = []) => {
    // Ensure options is an array or an empty array
    const transformations = Array.isArray(options) ? options : [options];
    return cloudinary_1.v2.url(publicId, {
        transformation: [
            { width: 400, height: 300, crop: "limit" },
            ...transformations,
        ],
    });
};
exports.generateThumbnailUrl = generateThumbnailUrl;
/**
 * Deletes an image from Cloudinary based on its public ID.
 * @param {string} publicId - The public ID of the image to be deleted.
 * @returns {Promise<void>} - A promise that resolves when the image is deleted.
 * @throws {Error} - If deletion fails.
 */
const deleteImageFromCloudinary = (publicId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield cloudinary_1.v2.uploader.destroy(publicId);
        console.log(`Image with public ID ${publicId} deleted successfully.`);
    }
    catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        throw new Error("Image deletion failed");
    }
});
exports.deleteImageFromCloudinary = deleteImageFromCloudinary;
