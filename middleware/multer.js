import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the current directory in ES module environments
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use a temporary directory for file uploads in cloud environments
const uploadDir = process.env.NODE_ENV === 'production'
  ? '/tmp/uploads' // AWS Lambda and other cloud environments
  : path.join(__dirname, '../uploads'); // Local development

// Ensure the uploads directory exists if running locally
if (process.env.NODE_ENV !== 'production' && !fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export default upload;
