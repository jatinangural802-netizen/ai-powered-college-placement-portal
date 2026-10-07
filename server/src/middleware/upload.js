import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { env } from '../config/env.js';
import { ApiError, sanitizeFilename } from '../utils/helpers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadPath = path.resolve(__dirname, '../../', env.uploadDir);

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const safe = sanitizeFilename(file.originalname);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safe}`;
    cb(null, unique);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== 'application/pdf') {
    return cb(new ApiError(400, 'Only PDF files are allowed'), false);
  }
  cb(null, true);
};

export const uploadResume = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.maxFileSize },
});

export const getUploadPath = () => uploadPath;

export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new ApiError(400, `File too large. Maximum size is ${env.maxFileSize / 1024 / 1024}MB`));
    }
    return next(new ApiError(400, err.message));
  }
  next(err);
};
