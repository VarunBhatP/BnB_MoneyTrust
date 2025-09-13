import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sanitize from 'sanitize-filename';
import type { Request } from 'express';

const uploadPath = path.join('uploads', 'budgets');

// Ensure upload directory exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const allowedExts = ['.csv', '.xls', '.xlsx'];

// Define multer file interface manually
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

// Fix: Use our custom interface instead of Express.Multer
const fileFilter = (req: Request, file: MulterFile, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExts.includes(ext)) {
    return cb(new Error('Only CSV and Excel files are allowed'));
  }
  cb(null, true);
};

const storage = multer.diskStorage({
  destination: (req: Request, file: MulterFile, cb: (error: Error | null, destination: string) => void) => {
    cb(null, uploadPath);
  },
  filename: (req: Request, file: MulterFile, cb: (error: Error | null, filename: string) => void) => {
    const ext = path.extname(file.originalname);
    const baseName = sanitize(path.basename(file.originalname, ext));
    cb(null, `${baseName}-${Date.now()}${ext}`);
  },
});

export const uploadBudgetFile = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});
