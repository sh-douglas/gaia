import { z } from "zod";
import { validateCPF } from "../../utils/isValidCpf.js";

export const cpfSchema = z
  .string()
  .trim()
  .regex(
    /^(?:\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/,
    "The CPF field must contain 11 digits, with or without punctuation",
  )
  .transform((cpf) => cpf.replace(/\D/g, ""))
  .refine((cpf) => validateCPF(cpf), {
    message: "Invalid CPF",
  });
