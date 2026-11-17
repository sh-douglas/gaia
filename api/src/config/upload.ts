import multer from 'multer';
import path from 'node:path';
import crypto from 'node:crypto';
import { AppError } from '../errors/app.error.js';
import { DOCTOR_NOTE_ORIGINALS_DIR } from './storage.js';

const allowedMimeTypes = new Set<string>([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, DOCTOR_NOTE_ORIGINALS_DIR);
  },
  filename(_req, file, cb) {
    cb(null, crypto.randomUUID() + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (allowedMimeTypes.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('File type not allowed.', 400, 'INVALID_FILE_TYPE'));
    }
  },
});
