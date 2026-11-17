import { z } from 'zod';
import { cpfSchema } from './common/cpf.schema.js';

const fullNameSchema = z
  .string()
  .trim()
  .min(3, 'The full name field must contain at least 3 characters');

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('The email field must be valid.');

const phoneSchema = z
  .string()
  .trim()
  .regex(/^[\d\s()-]+$/, {
    message: 'The phone number field contains invalid characters.',
  })
  .transform((value) => value.replace(/\D/g, ''))
  .refine((value) => value.length === 10 || value.length === 11, {
    message: 'The phone number must be 10 or 11 digits long.',
  });

const passwordSchema = z
  .string()
  .min(15, 'The password field must contain at least 15 characters')
  .refine((value) => Buffer.byteLength(value, 'utf8') <= 72, {
    message: 'The password must not exceed 72 bytes.',
  });

const createEmployeeSchema = z
  .object({
    fullName: fullNameSchema,
    cpf: cpfSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'The passwords must be the same',
    path: ['confirmPassword'],
  });

type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;

export {
  createEmployeeSchema,
  type CreateEmployeeInput,
  fullNameSchema,
  emailSchema,
  phoneSchema,
  passwordSchema,
};
