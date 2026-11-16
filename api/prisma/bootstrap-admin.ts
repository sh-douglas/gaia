import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma.js";
import { Role } from "../src/generated/prisma/enums.js";
import { cpfSchema } from "../src/validators/common/cpf.schema.js";
import {
  emailSchema,
  fullNameSchema,
  passwordSchema,
  phoneSchema,
} from "../src/validators/employee.validator.js";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function main() {
  const fullName = fullNameSchema.parse(
    getRequiredEnv("ADMIN_BOOTSTRAP_FULL_NAME"),
  );
  const cpf = cpfSchema.parse(getRequiredEnv("ADMIN_BOOTSTRAP_CPF"));
  const email = emailSchema.parse(getRequiredEnv("ADMIN_BOOTSTRAP_EMAIL"));
  const phone = phoneSchema.parse(getRequiredEnv("ADMIN_BOOTSTRAP_PHONE"));
  const password = passwordSchema.parse(
    getRequiredEnv("ADMIN_BOOTSTRAP_PASSWORD"),
  );

  const existingAdmin = await prisma.employee.findFirst({
    where: { role: Role.ADMIN },
  });

  if (existingAdmin) {
    throw new Error(
      "There is already an administrator registered in the system.",
    );
  }

  const existingEmployee = await prisma.employee.findFirst({
    where: {
      OR: [{ cpf }, { email }, { phone }],
    },
  });

  if (existingEmployee) {
    throw new Error("Employee already exists.");
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  await prisma.employee.create({
    data: {
      fullName,
      cpf,
      email,
      phone,
      passwordHash,
      role: Role.ADMIN,
    },
  });
}

try {
  await main();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
