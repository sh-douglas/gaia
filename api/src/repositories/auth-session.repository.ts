import { prisma } from '../lib/prisma.js';

interface AuthSessionCreateData {
  employeeId: string;
  expiresAt: Date;
}

class AuthSessionRepository {
  async create(data: AuthSessionCreateData) {
    return prisma.authSession.create({ data });
  }

  async findById(id: string) {
    return prisma.authSession.findUnique({
      where: { id },
    });
  }

  async revokeByIdAndEmployeeId(id: string, employeeId: string) {
    return prisma.authSession.updateMany({
      where: { id, employeeId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}

export default new AuthSessionRepository();
