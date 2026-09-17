import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app.error.js";
import { ZodError } from "zod";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
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

  console.error(error);
  return res.status(500).json({
    error: "An error occurred with your request. Please try again later.",
  });
}
