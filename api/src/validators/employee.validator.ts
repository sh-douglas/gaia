import { z } from "zod";
import { cpfSchema } from "./common/cpf.schema.js";

const createEmployeeSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, "The full name field must contain at least 3 characters"),
    cpf: cpfSchema,
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("The email field must be valid."),
    phone: z
      .string()
      .trim()
      .regex(/^[\d\s()-]+$/, {
        message: "The phone number field contains invalid characters.",
      })
      .transform((value) => value.replace(/\D/g, ""))
      .refine((value) => value.length === 10 || value.length === 11, {
        message: "The phone number must be 10 or 11 digits long.",
      }),
    password: z
      .string()
      .min(6, "The password field must contain at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "The confirm password field must contain at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "The passwords must be the same",
    path: ["confirmPassword"],
  });

type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;

export { createEmployeeSchema, type CreateEmployeeInput };
