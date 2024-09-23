"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_config_1 = require("../../config/app.config");
const { JWT_SECRET_KEY, JWT_EXPIRES_IN } = app_config_1.APP_CONFIG;
// Generate a JWT token
const generateToken = (userId) => {
    try {
        return jsonwebtoken_1.default.sign({ userId }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
    }
    catch (error) {
        console.error("Error generating token:", error);
        throw new Error("Could not generate token");
    }
};
exports.generateToken = generateToken;
// Verify a JWT token and return the userId
const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET_KEY);
        const { userId } = decoded;
        return parseInt(userId, 10);
    }
    catch (error) {
        console.error("Error verifying token:", error);
        throw new Error("Invalid token");
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=tokenUtils.js.map