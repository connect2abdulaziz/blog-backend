// interfaces.ts
export interface DbConfig {
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_HOST: string;
  DB_PORT?: string;
  DIALECT: string;
  SEEDER_STORAGE?: string;
  POSTGRES_URL?: string;
  USE_ENV_VARIABLE?: string;
  dialectOptions?: {
    ssl?: {
      require: boolean;
      rejectUnauthorized: boolean;
    };
  };
}

export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
}


export interface Config {
  development: DbConfig;
  test: DbConfig;
  production: DbConfig;
}



// Custom Types
import User from '../db/models/user'; 
import { Request } from 'express';

export interface IUserRequest extends Request {
  user: User; 
  file?: Express.Multer.File;
}

export interface ITokenRequest extends Request {
  body: { token: string };
}

// Type for pagination options
export interface PaginationOptions {
  limit: number;
  page: number;
  includeReplies?: boolean; // Optional for post comments
  model: User | Comment;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedRequest {
  query: {
    page?: number;
    limit?: number;
  };
}



// Authentication
export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export interface PasswordResetRequest {
  password: string;
}

export interface VerificationTokenPayload {
  userId: number;
}



// Common Response Interfaces
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  items: T[];
}



// File Upload
export interface FileUploadResponse {
  url: string;
  publicId: string;
}

export interface FileUploadRequest {
  file: Express.Multer.File;
}


// Error Handling
export interface ErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
}
