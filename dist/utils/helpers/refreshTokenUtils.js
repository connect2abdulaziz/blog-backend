"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeRefreshToken = exports.verifyRefreshToken = exports.generateRefreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appError_1 = require("../errors/appError");
const constants_1 = require("../constants/constants");
const app_config_1 = require("../../config/app.config");
const { JWT_REFRESH_SECRET_KEY, JWT_REFRESH_EXPIRES_IN } = app_config_1.APP_CONFIG;
// In-memory blacklist for invalidated tokens
const blacklist = new Set();
// Generate a JWT refresh token
const generateRefreshToken = (userId) => {
    try {
        const token = jsonwebtoken_1.default.sign({ userId }, JWT_REFRESH_SECRET_KEY, {
            expiresIn: JWT_REFRESH_EXPIRES_IN || "7d", // Default to 7 days if not set
        });
        return token;
    }
    catch (error) {
        console.error("Error generating refresh token:", error);
        throw new Error("Could not generate refresh token");
    }
};
exports.generateRefreshToken = generateRefreshToken;
// Verify a JWT refresh token
const verifyRefreshToken = (token) => {
    if (blacklist.has(token)) {
        throw new appError_1.AppError(constants_1.ERROR_MESSAGES.INVALID_REFRESH_TOKEN, constants_1.STATUS_CODE.UNAUTHORIZED);
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET_KEY);
        return decoded.userId;
    }
    catch (error) {
        console.error("Error verifying refresh token:", error);
        throw new appError_1.AppError(constants_1.ERROR_MESSAGES.INVALID_REFRESH_TOKEN, constants_1.STATUS_CODE.UNAUTHORIZED);
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
// Remove a JWT refresh token by adding it to the blacklist
const removeRefreshToken = (token) => {
    blacklist.add(token);
};
exports.removeRefreshToken = removeRefreshToken;
