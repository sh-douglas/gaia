import type { Request, Response, NextFunction } from "express";
import type { Role } from "../generated/prisma/enums.js";
import { AppError } from "../errors/app.error.js";

export function allowedRoles(...roles: Role[]) {
  return function (req: Request, _res: Response, next: NextFunction) {
    if (!req.employeeRole) {
      next(
        new AppError(
          "You do not have permission to access this resource",
          403,
          "FORBIDDEN",
        ),
      );
      return;
    }

    if (!roles.includes(req.employeeRole)) {
      next(
        new AppError(
          "You do not have permission to access this resource",
          403,
          "FORBIDDEN",
        ),
      );
      return;
    }

    next();
  };
}
