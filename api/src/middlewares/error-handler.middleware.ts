import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { MulterError } from "multer";
import { AppError } from "../errors/app.error.js";
import { cleanupUploadedFiles } from "../utils/cleanup-uploaded-files.js";

export async function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const files = Array.isArray(req.files) ? req.files : [];
  if (files.length > 0) {
    await cleanupUploadedFiles(files);
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
      code: error.code,
    });
  }

  if (error instanceof ZodError) {
    const issues = error.issues.map((issue) => {
      return {
        path: issue.path,
        message: issue.message,
      };
    });

    return res.status(400).json({
      error: "invalid request data",
      code: "VALIDATION_ERROR",
      issues,
    });
  }

  if (error instanceof MulterError) {
    switch (error.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(413).json({
          error: "The file size must be 10 megabytes or less.",
          code: "FILE_TOO_LARGE",
        });
      case "LIMIT_UNEXPECTED_FILE":
        return res.status(400).json({
          error: "The file you uploaded is invalid.",
          code: "INVALID_FILE_UPLOAD",
        });
      default:
        return res.status(400).json({
          error:
            "An error occurred while uploading your file. Please try again later.",
          code: "FILE_UPLOAD_ERROR",
        });
    }
  }

  console.error(error);
  return res.status(500).json({
    error: "An error occurred with your request. Please try again later.",
  });
}
