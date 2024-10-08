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
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const catchAsync_1 = __importDefault(require("./utils/errors/catchAsync"));
const appError_1 = require("./utils/errors/appError");
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const constants_1 = require("./utils/constants/constants");
const corsHandler_1 = __importDefault(require("./middleware/corsHandler"));
//import swaggerUi from "swagger-ui-express";
//import YAML from "yamljs";
// // Resolve the __dirname equivalent in ESM
const path_1 = __importDefault(require("path"));
// // Load Swagger file
// const swaggerFilePath = path.resolve(__dirname, "swagger.yaml");
// const swaggerDocument = YAML.load(swaggerFilePath);
// Create Express app
const app = (0, express_1.default)();
// Serve static files from the React app
app.use(express_1.default.static(path_1.default.join(__dirname, "client/build")));
// // Serve Swagger documentation
// app.use(
//   "/api-docs",
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerDocument, {
//     customCssUrl: process.env.SWAGGER_URL,
//   })
// );
// Middleware setup
app.use(express_1.default.json());
// Middleware setup for multipart upload
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use(express_1.default.static("public"));
// Apply CORS middleware
app.use(corsHandler_1.default);
// Mount API routes
app.use("/api/v1", index_1.default);
// Handle undefined routes
app.all("*", (0, catchAsync_1.default)((req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    next(new appError_1.AppError(`Can't find ${req.originalUrl} on this server`, constants_1.STATUS_CODE.NOT_FOUND));
})));
// Global error handler
app.use(errorHandler_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map