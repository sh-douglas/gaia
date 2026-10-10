import employeeRepository from "../repositories/employee.repository.js";
import { AppError } from "../errors/app.error.js";
import {
  signInSchema,
  type SignInInput,
} from "../validators/auth.validator.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

class AuthService {
  async signIn(data: SignInInput) {
    const parsedData = signInSchema.parse(data);

    const employee = await employeeRepository.findByCpf(parsedData.cpf);

    if (!employee) {
      throw new AppError("Invalid credentials.", 401, "INVALID_CREDENTIALS");
    }

    const isValidPassword = await bcrypt.compare(
      parsedData.password,
      employee.passwordHash,
    );

    if (!isValidPassword) {
      throw new AppError("Invalid credentials.", 401, "INVALID_CREDENTIALS");
    }

    if (employee.active === false) {
      throw new AppError(
        "This employee is not active.",
        403,
        "EMPLOYEE_INACTIVE",
      );
    }

    const token = jwt.sign(
      {
        sub: employee.id,
      },
      env.JWT_SECRET,
      {
        expiresIn: env.JWT_EXPIRES_IN,
      },
    );

    const employeeData = {
      id: employee.id,
      fullName: employee.fullName,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    };

    return {
      employeeData,
      token,
    };
  }
}

export default new AuthService();
