import employeeRepository from '../repositories/employee.repository.js';
import { AppError } from '../errors/app.error.js';
import {
  signInSchema,
  type SignInInput,
} from '../validators/auth.validator.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import authSessionRepository from '../repositories/auth-session.repository.js';

class AuthService {
  async signIn(data: SignInInput) {
    const parsedData = signInSchema.parse(data);

    const employee = await employeeRepository.findByCpf(parsedData.cpf);

    if (!employee) {
      throw new AppError('Invalid credentials.', 401, 'INVALID_CREDENTIALS');
    }

    const isValidPassword = await bcrypt.compare(
      parsedData.password,
      employee.passwordHash,
    );

    if (!isValidPassword) {
      throw new AppError('Invalid credentials.', 401, 'INVALID_CREDENTIALS');
    }

    if (employee.active === false) {
      throw new AppError(
        'This employee is not active.',
        403,
        'EMPLOYEE_INACTIVE',
      );
    }

    const expirationMinutes = env.JWT_EXPIRES_IN === '15m' ? 15 : 30;
    const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);
    const authSession = await authSessionRepository.create({
      employeeId: employee.id,
      expiresAt,
    });

    const token = jwt.sign(
      {
        sub: employee.id,
        sid: authSession.id,
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

  async signOut(employeeId: string, authSessionId: string) {
    await authSessionRepository.revokeByIdAndEmployeeId(
      authSessionId,
      employeeId,
    );
  }
}

export default new AuthService();
