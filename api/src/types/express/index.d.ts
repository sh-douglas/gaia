import type { Role } from "../../generated/prisma/enums.ts";

declare global {
  namespace Express {
    interface Request {
      employeeId: string;
      employeeRole?: Role;
    }
  }
}

export {};
