"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_CONFIG = void 0;
const dotenv_1 = require("dotenv");
// Load environment variables from .env file
(0, dotenv_1.config)();
// Export environment variables
exports.APP_CONFIG = {
    POSTGRES_URL: process.env.POSTGRES_URL,
    NODE_ENV: process.env.NODE_ENV,
    APP_PORT: process.env.APP_PORT,
    // DB Credentials
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: Number(process.env.DB_PORT),
    DIALECT: process.env.DIALECT,
    SEEDER_STORAGE: process.env.SEEDER_STORAGE,
    // JWT Information
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    // Refresh Token Information
    JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
    // Admin Credentials
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    // Email Credentials for password reset
    EMAIL_FORGOT_PASSWORD: process.env.EMAIL_FORGOT_PASSWORD,
    EMAIL_PASSWORD_FORGOT_PASSWORD: process.env.EMAIL_PASSWORD_FORGOT_PASSWORD,
    // Email Credentials for email verification
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_PASS: process.env.EMAIL_PASS,
    // Frontend URL
    FRONTEND_URL: process.env.FRONTEND_URL,
    // Swagger URL
    SWAGGER_URL: process.env.SWAGGER_URL,
    // Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET_KEY: process.env.CLOUDINARY_API_SECRET_KEY,
};
