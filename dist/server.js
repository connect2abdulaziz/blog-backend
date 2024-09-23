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
const app_config_1 = require("./config/app.config");
const app_1 = __importDefault(require("./app"));
const appLogger_1 = require("./utils/loggers/appLogger");
const sequelize_1 = __importDefault(require("./config/sequelize"));
const constants_1 = require("./utils/constants/constants");
//Start the server
const port = app_config_1.APP_CONFIG.APP_PORT || '3000';
const server = app_1.default.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    appLogger_1.logger.info(`App running on port ${port}...`);
    try {
        yield sequelize_1.default.authenticate();
        yield sequelize_1.default.sync();
        appLogger_1.logger.info(constants_1.SUCCESS_MESSAGES.DB_CONNECTION_SUCCESS);
    }
    catch (error) {
        if (error instanceof Error) {
            appLogger_1.logger.error(`${constants_1.ERROR_MESSAGES.DB_CONNECTION_ERROR}: ${error.message}`);
        }
        appLogger_1.logger.error(`${constants_1.ERROR_MESSAGES.UNEXPECTED_ERROR}`);
        process.exit(1);
    }
}));
// Handle unhandled promise rejections and uncaught exceptions
process.on("uncaughtException", (err) => {
    appLogger_1.logger.error(`${constants_1.ERROR_MESSAGES.UNCAUGHT_EXCEPTION_ERROR}: ${err.message}`);
    process.exit(1);
});
process.on("unhandledRejection", (reason) => {
    appLogger_1.logger.error(`${constants_1.ERROR_MESSAGES.UNHANDLED_REJECTION_ERROR}: ${reason}`);
    server.close(() => {
        process.exit(1);
    });
});
