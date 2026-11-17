import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../errors/app.error.js";
import employeeRepository from "../repositories/employee.repository.js";
import authSessionRepository from "../repositories/auth-session.repository.js";
import { z } from "zod";

export async function ensureAuthenticated(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;
  let decoded;

  if (!header) {
    next(new AppError("Unauthorized.", 401, "UNAUTHORIZED_ACCESS"));
    return;
  }

  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    next(new AppError("Unauthorized.", 401, "UNAUTHORIZED_ACCESS"));
    return;
  }

  try {
    decoded = jwt.verify(token, env.JWT_SECRET);

    if (typeof decoded === "string") {
      next(new AppError("Unauthorized.", 401, "UNAUTHORIZED_ACCESS"));
      return;
    }
  } catch {
    next(new AppError("Unauthorized.", 401, "UNAUTHORIZED_ACCESS"));
    return;
  }

  if (
    typeof decoded.sub !== "string" ||
    !z.uuid().safeParse(decoded.sub).success
  ) {
    next(new AppError("Unauthorized.", 401, "UNAUTHORIZED_ACCESS"));
    return;
  }

  if (
    typeof decoded.sid !== "string" ||
    !z.uuid().safeParse(decoded.sid).success
  ) {
    next(new AppError("Unauthorized.", 401, "UNAUTHORIZED_ACCESS"));
    return;
  }

  const sub = decoded.sub;
  const sid = decoded.sid;
  const employee = await employeeRepository.findById(sub);
  const authSession = await authSessionRepository.findById(sid);

  if (authSession === null) {
    next(new AppError("Unauthorized.", 401, "UNAUTHORIZED_ACCESS"));
    return;
  }

  if (!employee) {
    next(new AppError("Unauthorized.", 401, "UNAUTHORIZED_ACCESS"));
    return;
  }

  if (authSession.employeeId !== sub) {
    next(new AppError("Unauthorized.", 401, "UNAUTHORIZED_ACCESS"));
    return;
  }

  if (authSession.revokedAt !== null) {
    next(new AppError("Unauthorized.", 401, "UNAUTHORIZED_ACCESS"));
    return;
  }

  if (authSession.expiresAt.getTime() <= Date.now()) {
    next(new AppError("Unauthorized.", 401, "UNAUTHORIZED_ACCESS"));
    return;
  }

  if (employee.active === false) {
    next(
      new AppError(
        "This employee account is inactive.",
        403,
        "EMPLOYEE_INACTIVE",
      ),
    );
    return;
  }

  req.employeeId = employee.id;
  req.employeeRole = employee.role;
  req.authSessionId = authSession.id;

  next();
}
