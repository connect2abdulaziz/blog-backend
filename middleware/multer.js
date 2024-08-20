import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Resolve __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory for uploads
const uploadDir = path.join(__dirname, '../uploads');

// Ensure the uploads directory exists
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (error) {
  console.error('Error creating upload directory:', error);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Use the uploadDir variable
  },
  filename: (req, file, cb) => {
    // Create a unique filename
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export default upload;
