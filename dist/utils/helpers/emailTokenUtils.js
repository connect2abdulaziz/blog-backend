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
exports.sendEmailWithToken = void 0;
const tokenUtils_1 = require("./tokenUtils");
const emailUtils_1 = __importDefault(require("./emailUtils"));
const constants_1 = require("../constants/constants");
const appError_1 = require("../errors/appError");
const app_config_1 = require("../../config/app.config");
// Ensure environment variables are typed
const { FRONTEND_URL } = app_config_1.APP_CONFIG;
// Send an email with a generated token
const sendEmailWithToken = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, email, subject, textTemplate, htmlTemplate, endpoint, }) {
    try {
        // Generate a token with the user ID and expiration time
        const token = (0, tokenUtils_1.generateToken)(userId);
        // Encode the token (for safe use in URLs)
        const encodedToken = encodeURIComponent(token);
        // Construct the URL with the token in the path
        const url = `${FRONTEND_URL}${endpoint}/${encodedToken}`;
        // Prepare the email content using the provided templates
        const textContent = textTemplate(url);
        const htmlContent = htmlTemplate(url);
        // Send the email
        yield (0, emailUtils_1.default)({
            to: email,
            subject,
            text: textContent,
            html: htmlContent,
        });
    }
    catch (error) {
        throw new appError_1.AppError(constants_1.ERROR_MESSAGES.EMAIL_SEND_FAILED, constants_1.STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
});
exports.sendEmailWithToken = sendEmailWithToken;
//# sourceMappingURL=emailTokenUtils.js.map