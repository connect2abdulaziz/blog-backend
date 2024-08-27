import { createClient } from "redis";
import crypto from "crypto";
import AppError from "../errors/appError.js";
import { ERROR_MESSAGES, STATUS_CODE } from "../constants/constants.js";

// Create Redis client
const redisClient = createClient();

redisClient.on("error", (err) => console.error("Redis Client Error", err));

await redisClient.connect();

const generateRefreshToken = async (userId) => {
  const token = crypto.randomBytes(40).toString("hex");
  const expiresAt = 7 * 24 * 60 * 60; // 7 days in seconds

  // Store the token in Redis with expiration time
  await redisClient.setEx(token, expiresAt, userId);

  return token;
};

const verifyRefreshToken = async (token) => {
  const userId = await redisClient.get(token);

  if (!userId) {
    throw new AppError(ERROR_MESSAGES.INVALID_REFRESH_TOKEN, STATUS_CODE.UNAUTHORIZED);
  }

  return { token, userId };
};

const removeRefreshToken = async (token) => {
  await redisClient.del(token);
};

export { generateRefreshToken, verifyRefreshToken, removeRefreshToken };
