import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma.js";
import { Role } from "../src/generated/prisma/enums.js";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function main() {
  const fullName = getRequiredEnv("SMO_SEED_FULL_NAME");
  const cpf = getRequiredEnv("SMO_SEED_CPF");
  const email = getRequiredEnv("SMO_SEED_EMAIL");
  const phone = getRequiredEnv("SMO_SEED_PHONE");
  const password = getRequiredEnv("SMO_SEED_PASSWORD");

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  await prisma.employee.upsert({
    where: { cpf },
    update: {},
    create: {
      fullName,
      cpf,
      email,
      phone,
      passwordHash,
      role: Role.SMO,
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
