import express, { Request, Response, NextFunction } from "express";
import sequelize from "./config/database";
import appRouter from "./routes/index"; // Fixed double slash
import catchAsync from "./utils/errors/catchAsync";
import AppError from "./utils/errors/appError";
import globalErrorHandler from "./utils/errors/errorHandler";
import { STATUS_CODE } from "./utils/constants/constants";

import corsHandler from "./middleware/corsHandler";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path, { dirname } from "path";
import { fileURLToPath } from 'url'; // Import fileURLToPath for ES Modules

// Resolve the __dirname equivalent in ESM
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);

// Load Swagger file
//const swaggerFilePath = path.resolve(__dirname, "swagger.yaml");
//const swaggerDocument = YAML.load(swaggerFilePath);

// Create Express app
const app = express();

// Serve static files from the React app
//app.use(express.static(path.join(__dirname, "client/build")));

// Serve Swagger documentation
// app.use(
//   "/api-docs",
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerDocument, {
//     customCssUrl: process.env.SWAGGER_URL,
//   })
// );

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static("public"));

// Apply CORS middleware
app.use(corsHandler);

// Mount API routes
app.use("/api/v1", appRouter);

// Handle undefined routes
app.all(
  "*",
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    next(
      new AppError(
        `Can't find ${req.originalUrl} on this server`,
        STATUS_CODE.NOT_FOUND
      )
    );
  })
);

// Global error handler
app.use(globalErrorHandler);

// Start server
const PORT = process.env.APP_PORT || 4000;
app.listen(PORT, async () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});

export default app;
