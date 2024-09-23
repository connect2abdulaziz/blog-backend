"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogger = void 0;
const morgan_1 = __importDefault(require("morgan"));
const appLogger_1 = require("./appLogger");
const constants_1 = require("../constants/constants");
const morgan_json_1 = __importDefault(require("morgan-json"));
// Define the JSON format for morgan
const format = (0, morgan_json_1.default)({
    method: ":method",
    url: ":url",
    status: ":status",
    contentLength: ":res[content-length]",
    responseTime: ":response-time",
});
// Define the stream options for morgan
const stream = {
    write: (message) => {
        try {
            const { method, url, status, contentLength, responseTime } = JSON.parse(message);
            appLogger_1.logger.info(` ************* ${constants_1.SUCCESS_MESSAGES.HTTPS_REQUEST} *************
        TIMESTAMP = ${new Date().toString()} 
        METHOD = ${method} 
        URL = ${url} 
        STATUS = ${Number(status)} 
        CONTENT-LENGTH = ${contentLength} bytes 
        RESPONSE-TIME = ${responseTime} ms`);
        }
        catch (error) {
            appLogger_1.logger.error("Error parsing morgan log message: ", error);
        }
    },
};
// Create the morgan HTTP logger
exports.httpLogger = (0, morgan_1.default)(format, { stream });
