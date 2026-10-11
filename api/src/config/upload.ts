import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";
import { AppError } from "../errors/app.error.js";

const allowedMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(
      null,
      path.resolve(process.cwd(), "storage", "doctor-notes", "originals"),
    );
  },
  filename: function (_req, file, cb) {
    cb(null, crypto.randomUUID() + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError("File type not allowed.", 400, "INVALID_FILE_TYPE"));
    }
  },
});
