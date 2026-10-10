import bcrypt from "bcryptjs";
import { AppError } from "../errors/app.error.js";
import employeeRepository from "../repositories/employee.repository.js";
import {
  type CreateEmployeeInput,
  createEmployeeSchema,
} from "../validators/employee.validator.js";

class EmployeeService {
  async create(data: CreateEmployeeInput) {
    const parsedData = createEmployeeSchema.parse(data);

    const existingEmployeeCpf = await employeeRepository.findByCpf(
      parsedData.cpf,
    );

    if (existingEmployeeCpf) {
      throw new AppError(
        "An employee with this CPF already exists.",
        409,
        "EMPLOYEE_CPF_ALREADY_EXISTS",
      );
    }

    const existingEmployeeEmail = await employeeRepository.findByEmail(
      parsedData.email,
    );

    if (existingEmployeeEmail) {
      throw new AppError(
        "An employee with this email already exists.",
        409,
        "EMPLOYEE_EMAIL_ALREADY_EXISTS",
      );
    }

    const existingEmployeePhone = await employeeRepository.findByPhone(
      parsedData.phone,
    );

    if (existingEmployeePhone) {
      throw new AppError(
        "An employee with this phone already exists.",
        409,
        "EMPLOYEE_PHONE_ALREADY_EXISTS",
      );
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(parsedData.password, salt);

    const employeeData = {
      fullName: parsedData.fullName,
      cpf: parsedData.cpf,
      email: parsedData.email,
      phone: parsedData.phone,
      passwordHash,
    };

    const employee = await employeeRepository.create(employeeData);

    const publicEmployeeData = {
      id: employee.id,
      fullName: employee.fullName,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    };

    return publicEmployeeData;
  }
}

export default new EmployeeService();
