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
const nodemailer_1 = __importDefault(require("nodemailer"));
const app_config_1 = require("../../config/app.config");
const { EMAIL_FROM, EMAIL_PASS } = app_config_1.APP_CONFIG;
const transporter = nodemailer_1.default.createTransport({
    service: "Gmail",
    auth: {
        user: EMAIL_FROM,
        pass: EMAIL_PASS,
    },
    logger: true,
    debug: true,
});
const sendEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, text, html, }) {
    const mailOptions = {
        from: EMAIL_FROM,
        to,
        subject,
        text,
        html,
    };
    try {
        yield transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    }
    catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Could not send email");
    }
});
exports.default = sendEmail;
