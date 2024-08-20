import fs from 'fs-extra';
import path from 'path';
import multer from 'multer';

// Define the path for the uploads directory
const uploadDir = path.join(__dirname, '../uploads');

// Create the directory if it doesn't exist
fs.ensureDirSync(uploadDir);

// Configure multer to use the uploads directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export default upload;
