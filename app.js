require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");
const app = express();
const sequelize = require("./config/database");

const catchAsync = require("./utils/catchAsync");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./utils/errorHandler");
const { STATUS_CODE } = require("./utils/constants");

const userRouter = require("./routes/userRoute");
const postRouter = require('./routes/postRoute');
const commentRouter = require('./routes/commentRoute');

app.use(express.json());

// Define routes
app.use("/api/v1/users", userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/comments', commentRouter);

// Handle undefined routes
app.all("*", catchAsync(async (req, res, next) => {
  return next(new AppError(`Can't find ${req.originalUrl} on this server`, STATUS_CODE.NOT_FOUND));
}));

// Global error handler
app.use(globalErrorHandler);

const PORT = process.env.APP_PORT || 4000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
