import { prisma } from "../lib/prisma.js";

interface EmployeeCreateData {
  fullName: string;
  cpf: string;
  email: string;
  phone: string;
  passwordHash: string;
}

class EmployeeRepository {
  async create(data: EmployeeCreateData) {
    return prisma.employee.create({ data });
  }

  async findById(id: string) {
    return prisma.employee.findUnique({
      where: {
        id,
      },
    });
  }

  async findByCpf(cpf: string) {
    return prisma.employee.findUnique({
      where: {
        cpf,
      },
    });
  }

  async findByEmail(email: string) {
    return prisma.employee.findUnique({
      where: {
        email,
      },
    });
  }

  async findByPhone(phone: string) {
    return prisma.employee.findUnique({
      where: {
        phone,
      },
    });
  }
}

export default new EmployeeRepository();
