
import { Multer } from 'multer'; 

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      file?: Express.Multer.File; 
    }
  }
}
