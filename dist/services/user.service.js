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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUserServices = exports.refreshTokenServices = exports.updateUserImageServices = exports.changePasswordServices = exports.deleteUserServices = exports.updateUserServices = exports.getUserByIdServices = exports.resetPasswordServices = exports.forgotPasswordServices = exports.loginUserServices = exports.verifyEmailServices = exports.createUserServices = void 0;
// External Libraries
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../db/models/user.model"));
// Internal Modules
const appError_1 = require("../utils/errors/appError");
const hashPasswordUtils_1 = require("../utils/helpers/hashPasswordUtils");
const tokenUtils_1 = require("../utils/helpers/tokenUtils");
const emailTokenUtils_1 = require("../utils/helpers/emailTokenUtils");
const refreshTokenUtils_1 = require("../utils/helpers/refreshTokenUtils");
const cloudinary_1 = require("../utils/cloudinary");
// Constants and Configuration
const constants_1 = require("../utils/constants/constants");
const emailTemplates_1 = require("../utils/constants/emailTemplates");
const createUserServices = (_a) => __awaiter(void 0, [_a], void 0, function* ({ firstName, lastName, email, password, }) {
    try {
        const alreadyRegistered = yield findByEmail(email);
        if (alreadyRegistered) {
            throw new appError_1.AppError(constants_1.ERROR_MESSAGES.EMAIL_ALREADY_EXISTS, constants_1.STATUS_CODE.BAD_REQUEST);
        }
        const hashedPassword = yield (0, hashPasswordUtils_1.hashPassword)(password);
        const newUser = yield user_model_1.default.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            verified: false,
        });
        yield (0, emailTokenUtils_1.sendEmailWithToken)({
            userId: newUser.id,
            email,
            subject: emailTemplates_1.EMAIL_SUBJECTS.EMAIL_VERIFICATION,
            textTemplate: emailTemplates_1.EMAIL_TEMPLATES.EMAIL_VERIFICATION.text,
            htmlTemplate: emailTemplates_1.EMAIL_TEMPLATES.EMAIL_VERIFICATION.html,
            endpoint: emailTemplates_1.EMAIL_CONSTANTS.VERIFY_EMAIL_ENDPOINT,
            tokenExpiresIn: emailTemplates_1.EMAIL_CONSTANTS.VERIFY_EMAIL_TOKEN_EXPIRATION,
        });
        const token = (0, tokenUtils_1.generateToken)(newUser.id);
        const refreshToken = (0, refreshTokenUtils_1.generateRefreshToken)(newUser.id);
        return { token, refreshToken };
    }
    catch (error) {
        throw error;
    }
});
exports.createUserServices = createUserServices;
const forgotPasswordServices = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield findByEmail(email);
        if (!user) {
            throw new appError_1.AppError(constants_1.ERROR_MESSAGES.USER_NOT_FOUND, constants_1.STATUS_CODE.NOT_FOUND);
        }
        yield (0, emailTokenUtils_1.sendEmailWithToken)({
            userId: user.id,
            email,
            subject: emailTemplates_1.EMAIL_SUBJECTS.PASSWORD_RESET,
            textTemplate: emailTemplates_1.EMAIL_TEMPLATES.PASSWORD_RESET.text,
            htmlTemplate: emailTemplates_1.EMAIL_TEMPLATES.PASSWORD_RESET.html,
            endpoint: emailTemplates_1.EMAIL_CONSTANTS.RESET_PASSWORD_ENDPOINT,
            tokenExpiresIn: emailTemplates_1.EMAIL_CONSTANTS.RESET_PASSWORD_TOKEN_EXPIRATION,
        });
        return { id: user.id };
    }
    catch (error) {
        throw error;
    }
});
exports.forgotPasswordServices = forgotPasswordServices;
const verifyEmailServices = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = (0, tokenUtils_1.verifyToken)(token);
        const user = yield user_model_1.default.findByPk(userId);
        if (!user) {
            throw new appError_1.AppError(constants_1.ERROR_MESSAGES.USER_NOT_FOUND, constants_1.STATUS_CODE.NOT_FOUND);
        }
        if (user.verified) {
            throw new appError_1.AppError(constants_1.ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED, constants_1.STATUS_CODE.BAD_REQUEST);
        }
        yield user_model_1.default.update({ verified: true }, { where: { id: user.id } });
        return { id: user.id };
    }
    catch (error) {
        throw error;
    }
});
exports.verifyEmailServices = verifyEmailServices;
const loginUserServices = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password, }) {
    try {
        const user = yield user_model_1.default.findOne({ where: { email } });
        if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
            throw new appError_1.AppError(constants_1.ERROR_MESSAGES.INCORRECT_EMAIL_OR_PASSWORD, constants_1.STATUS_CODE.BAD_REQUEST);
        }
        if (!user.verified) {
            throw new appError_1.AppError(constants_1.ERROR_MESSAGES.EMAIL_NOT_VERIFIED, constants_1.STATUS_CODE.BAD_REQUEST);
        }
        const token = (0, tokenUtils_1.generateToken)(user.id);
        const refreshToken = (0, refreshTokenUtils_1.generateRefreshToken)(user.id);
        return { token, refreshToken };
    }
    catch (error) {
        throw error;
    }
});
exports.loginUserServices = loginUserServices;
const resetPasswordServices = (_a, token_1) => __awaiter(void 0, [_a, token_1], void 0, function* ({ password }, token) {
    try {
        const userId = (0, tokenUtils_1.verifyToken)(token);
        const user = yield user_model_1.default.findByPk(userId);
        if (!user) {
            throw new appError_1.AppError(constants_1.ERROR_MESSAGES.USER_NOT_FOUND, constants_1.STATUS_CODE.NOT_FOUND);
        }
        const hashedPassword = yield (0, hashPasswordUtils_1.hashPassword)(password);
        user.password = hashedPassword;
        yield user.save();
        return { id: user.id };
    }
    catch (error) {
        throw error;
    }
});
exports.resetPasswordServices = resetPasswordServices;
const getUserByIdServices = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findByPk(id, {
            attributes: { exclude: ["password"] },
        });
        if (!user) {
            throw new appError_1.AppError(constants_1.ERROR_MESSAGES.USER_NOT_FOUND, constants_1.STATUS_CODE.NOT_FOUND);
        }
        return user;
    }
    catch (error) {
        throw error;
    }
});
exports.getUserByIdServices = getUserByIdServices;
const updateUserServices = (userId, updates) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findByPk(userId);
        if (!user) {
            throw new appError_1.AppError(constants_1.ERROR_MESSAGES.USER_NOT_FOUND, constants_1.STATUS_CODE.NOT_FOUND);
        }
        yield user.update(updates);
        const _a = user.toJSON(), { password } = _a, cleanedResult = __rest(_a, ["password"]);
        return cleanedResult;
    }
    catch (error) {
        throw error;
    }
});
exports.updateUserServices = updateUserServices;
const deleteUserServices = (userId, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findByPk(userId);
        if (!user) {
            throw new appError_1.AppError(constants_1.ERROR_MESSAGES.USER_NOT_FOUND, constants_1.STATUS_CODE.NOT_FOUND);
        }
        const isValidPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            throw new appError_1.AppError(constants_1.ERROR_MESSAGES.INCORRECT_PASSWORD, constants_1.STATUS_CODE.BAD_REQUEST);
        }
        if (user.profilePicture) {
            const publicId = user.profilePicture
                .split("/")
                .slice(-2)
                .join("/")
                .split(".")[0];
            yield (0, cloudinary_1.deleteImageFromCloudinary)(publicId);
        }
        yield user.destroy();
        return { id: userId };
    }
    catch (error) {
        throw error;
    }
});
exports.deleteUserServices = deleteUserServices;
const changePasswordServices = (userId_1, _a) => __awaiter(void 0, [userId_1, _a], void 0, function* (userId, { currentPassword, newPassword, }) {
    try {
        const user = yield user_model_1.default.findByPk(userId);
        if (!user) {
            throw new appError_1.AppError(constants_1.ERROR_MESSAGES.USER_NOT_FOUND, constants_1.STATUS_CODE.NOT_FOUND);
        }
        if (!(yield bcrypt_1.default.compare(currentPassword, user.password))) {
            throw new appError_1.AppError(constants_1.ERROR_MESSAGES.INCORRECT_OLD_PASSWORD, constants_1.STATUS_CODE.BAD_REQUEST);
        }
        const hashedPassword = yield (0, hashPasswordUtils_1.hashPassword)(newPassword);
        user.password = hashedPassword;
        yield user.save();
        const _b = user.toJSON(), { password } = _b, cleanedResult = __rest(_b, ["password"]);
        return cleanedResult;
    }
    catch (error) {
        throw error;
    }
});
exports.changePasswordServices = changePasswordServices;
const updateUserImageServices = (userId, file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findByPk(userId);
        if (!user) {
            throw new appError_1.AppError(constants_1.ERROR_MESSAGES.USER_NOT_FOUND, constants_1.STATUS_CODE.NOT_FOUND);
        }
        let imageUrl = null;
        let thumbnailUrl = null;
        if (file && file.path) {
            if (user.profilePicture) {
                const publicId = user.profilePicture
                    .split("/")
                    .slice(-2)
                    .join("/")
                    .split(".")[0];
                yield (0, cloudinary_1.deleteImageFromCloudinary)(publicId);
            }
            // Upload the image to Cloudinary
            imageUrl = yield (0, cloudinary_1.uploadImageToCloudinary)(file.path);
            // Extract the public ID from the image URL
            const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
            // Generate the thumbnail URL
            thumbnailUrl = (0, cloudinary_1.generateThumbnailUrl)(publicId);
        }
        user.thumbnail = thumbnailUrl;
        user.profilePicture = imageUrl;
        yield user.save();
        const _a = user.toJSON(), { password } = _a, cleanedResult = __rest(_a, ["password"]);
        return cleanedResult;
    }
    catch (error) {
        throw error;
    }
});
exports.updateUserImageServices = updateUserImageServices;
const refreshTokenServices = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = (0, refreshTokenUtils_1.verifyRefreshToken)(token);
        const user = yield user_model_1.default.findByPk(userId);
        if (!user) {
            throw new appError_1.AppError(constants_1.ERROR_MESSAGES.USER_NOT_FOUND, constants_1.STATUS_CODE.UNAUTHORIZED);
        }
        // Generate new tokens
        const newAccessToken = (0, tokenUtils_1.generateToken)(user.id);
        const newRefreshToken = (0, refreshTokenUtils_1.generateRefreshToken)(user.id);
        // Remove old refresh token
        (0, refreshTokenUtils_1.removeRefreshToken)(token);
        return {
            token: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }
    catch (error) {
        // Logout if token verification fails
        (0, refreshTokenUtils_1.removeRefreshToken)(token);
        throw error;
    }
});
exports.refreshTokenServices = refreshTokenServices;
const logoutUserServices = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, refreshTokenUtils_1.removeRefreshToken)(refreshToken);
        return {};
    }
    catch (error) {
        throw error;
    }
});
exports.logoutUserServices = logoutUserServices;
// Function to find a user by email
const findByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exists = yield user_model_1.default.findOne({ where: { email } });
        return exists;
    }
    catch (error) {
        throw error;
    }
});
