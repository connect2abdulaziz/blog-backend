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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.updateImage = exports.changePassword = exports.deleteUser = exports.updateUser = exports.getUserById = exports.resetPassword = exports.forgotPassword = exports.login = exports.verifyEmail = exports.signup = void 0;
const catchAsync_1 = __importDefault(require("../utils/errors/catchAsync"));
const appError_1 = require("../utils/errors/appError");
const appSuccess_1 = __importDefault(require("../utils/errors/appSuccess"));
const user_validator_1 = require("../utils/validations/user.validator");
const user_service_1 = require("../services/user.service");
const constants_1 = require("../utils/constants/constants");
// Signup Controller
const signup = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = user_validator_1.userSchema.validate(req.body);
    if (error) {
        throw next(new appError_1.AppError(error.details[0].message, constants_1.STATUS_CODE.BAD_REQUEST));
    }
    const result = yield (0, user_service_1.createUserServices)(value);
    return res
        .status(constants_1.STATUS_CODE.CREATED)
        .json((0, appSuccess_1.default)(constants_1.SUCCESS_MESSAGES.USER_CREATED, result));
}));
exports.signup = signup;
// Verify Email Controller
const verifyEmail = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const result = yield (0, user_service_1.verifyEmailServices)(token);
    return res
        .status(constants_1.STATUS_CODE.OK)
        .json((0, appSuccess_1.default)(constants_1.SUCCESS_MESSAGES.EMAIL_VERIFIED, result));
}));
exports.verifyEmail = verifyEmail;
// Login Controller
const login = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = user_validator_1.loginSchema.validate(req.body);
    if (error) {
        throw next(new appError_1.AppError(error.details[0].message, constants_1.STATUS_CODE.BAD_REQUEST));
    }
    const token = yield (0, user_service_1.loginUserServices)(value);
    return res
        .status(constants_1.STATUS_CODE.OK)
        .json((0, appSuccess_1.default)(constants_1.SUCCESS_MESSAGES.USER_LOGGED_IN, token));
}));
exports.login = login;
// Forgot Password Controller
const forgotPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = user_validator_1.forgotPasswordSchema.validate(req.body);
    if (error) {
        throw next(new appError_1.AppError(error.details[0].message, constants_1.STATUS_CODE.BAD_REQUEST));
    }
    const { email } = value;
    const result = yield (0, user_service_1.forgotPasswordServices)(email);
    return res
        .status(constants_1.STATUS_CODE.OK)
        .json((0, appSuccess_1.default)(constants_1.SUCCESS_MESSAGES.PASSWORD_RESET_EMAIL_SENT, result));
}));
exports.forgotPassword = forgotPassword;
// Reset Password Controller
const resetPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = user_validator_1.resetPasswordSchema.validate(req.body);
    if (error) {
        throw next(new appError_1.AppError(error.details[0].message, constants_1.STATUS_CODE.BAD_REQUEST));
    }
    const { token } = req.params;
    const result = yield (0, user_service_1.resetPasswordServices)(value, token);
    return res
        .status(constants_1.STATUS_CODE.OK)
        .json((0, appSuccess_1.default)(constants_1.SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS, result));
}));
exports.resetPassword = resetPassword;
// Get User By ID Controller
const getUserById = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Getting current user...");
    const userId = req.userId;
    console.log(userId);
    if (!userId) {
        throw next(new appError_1.AppError("User not found", constants_1.STATUS_CODE.NOT_FOUND));
    }
    const user = yield (0, user_service_1.getUserByIdServices)(userId);
    return res
        .status(constants_1.STATUS_CODE.OK)
        .json((0, appSuccess_1.default)(constants_1.SUCCESS_MESSAGES.USER_FETCHED, user));
}));
exports.getUserById = getUserById;
// Update User Controller
const updateUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = user_validator_1.updateUserSchema.validate(req.body);
    if (error) {
        throw next(new appError_1.AppError(error.details[0].message, constants_1.STATUS_CODE.BAD_REQUEST));
    }
    const userId = req.userId;
    if (!userId) {
        throw next(new appError_1.AppError("User not found", constants_1.STATUS_CODE.NOT_FOUND));
    }
    const updatedUser = yield (0, user_service_1.updateUserServices)(userId, value);
    return res
        .status(constants_1.STATUS_CODE.OK)
        .json((0, appSuccess_1.default)(constants_1.SUCCESS_MESSAGES.USER_UPDATED, updatedUser));
}));
exports.updateUser = updateUser;
// Delete User Controller
const deleteUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { password } = req.body;
    if (!userId) {
        throw next(new appError_1.AppError("User not found", constants_1.STATUS_CODE.NOT_FOUND));
    }
    yield (0, user_service_1.deleteUserServices)(userId, password);
    return res.json((0, appSuccess_1.default)(constants_1.SUCCESS_MESSAGES.USER_DELETED, userId));
}));
exports.deleteUser = deleteUser;
// Change Password Controller
const changePassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = user_validator_1.changePasswordSchema.validate(req.body);
    if (error) {
        throw next(new appError_1.AppError(error.details[0].message, constants_1.STATUS_CODE.BAD_REQUEST));
    }
    const userId = req.userId;
    yield (0, user_service_1.changePasswordServices)(userId, value);
    return res
        .status(constants_1.STATUS_CODE.OK)
        .json((0, appSuccess_1.default)(constants_1.SUCCESS_MESSAGES.PASSWORD_CHANGED, []));
}));
exports.changePassword = changePassword;
// Upload User Image Controller
const updateImage = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId || !req.file) {
        throw next(new appError_1.AppError("User not found or no file uploaded", constants_1.STATUS_CODE.BAD_REQUEST));
    }
    const result = yield (0, user_service_1.updateUserImageServices)(userId, req.file);
    return res
        .status(constants_1.STATUS_CODE.OK)
        .json((0, appSuccess_1.default)(constants_1.SUCCESS_MESSAGES.USER_IMAGE_UPDATED, result));
}));
exports.updateImage = updateImage;
// Refresh Token Controller
const refreshToken = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    const tokens = yield (0, user_service_1.refreshTokenServices)(token);
    return res
        .status(constants_1.STATUS_CODE.OK)
        .json((0, appSuccess_1.default)(constants_1.SUCCESS_MESSAGES.REFRESH_TOKEN, tokens));
}));
exports.refreshToken = refreshToken;
// Logout Controller
const logout = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    yield (0, user_service_1.logoutUserServices)(token);
    return res
        .status(constants_1.STATUS_CODE.OK)
        .json((0, appSuccess_1.default)(constants_1.SUCCESS_MESSAGES.LOGOUT_SUCCESS, {}));
}));
exports.logout = logout;
