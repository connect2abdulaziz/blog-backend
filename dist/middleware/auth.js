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
exports.authentication = void 0;
const user_model_1 = __importDefault(require("../db/models/user.model"));
const catchAsync_1 = __importDefault(require("../utils/errors/catchAsync"));
const appError_1 = require("../utils/errors/appError");
const constants_1 = require("../utils/constants/constants");
const tokenUtils_1 = require("../utils/helpers/tokenUtils");
// Middleware for authentication
const authentication = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Get the token from the header
    let idToken = "";
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        idToken = req.headers.authorization.split(" ")[1];
    }
    if (!idToken) {
        throw next(new appError_1.AppError(constants_1.ERROR_MESSAGES.INVALID_TOKEN, constants_1.STATUS_CODE.UNAUTHORIZED));
    }
    const userId = (0, tokenUtils_1.verifyToken)(idToken);
    // Get the user information from the DB and add them to the req object
    const freshUser = yield user_model_1.default.findByPk(userId);
    if (!freshUser) {
        throw next(new appError_1.AppError(constants_1.ERROR_MESSAGES.USER_NOT_FOUND, constants_1.STATUS_CODE.BAD_REQUEST));
    }
    // Set user ID on the req object
    req.userId = freshUser.id;
    return next();
}));
exports.authentication = authentication;
