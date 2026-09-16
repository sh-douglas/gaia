-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OPERATOR', 'SMO');

-- CreateEnum
CREATE TYPE "DoctorNoteStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Employee" (
    "id" UUID NOT NULL,
    "fullName" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "role" "Role" NOT NULL DEFAULT 'OPERATOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorNote" (
    "id" UUID NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL,
    "restDays" INTEGER NOT NULL,
    "restEndsAt" TIMESTAMP(3) NOT NULL,
    "employeeId" UUID NOT NULL,
    "smoId" UUID,
    "status" "DoctorNoteStatus" NOT NULL DEFAULT 'PENDING',
    "doctorName" TEXT NOT NULL,
    "crm" TEXT NOT NULL,
    "clinic" TEXT NOT NULL,
    "noteType" TEXT NOT NULL,
    "cid" TEXT NOT NULL,
    "observation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorNoteFile" (
    "id" UUID NOT NULL,
    "originalFile" TEXT NOT NULL,
    "optimizedFile" TEXT NOT NULL,
    "doctorNoteId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorNoteFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_cpf_key" ON "Employee"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_phone_key" ON "Employee"("phone");

-- AddForeignKey
ALTER TABLE "DoctorNote" ADD CONSTRAINT "DoctorNote_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorNote" ADD CONSTRAINT "DoctorNote_smoId_fkey" FOREIGN KEY ("smoId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorNoteFile" ADD CONSTRAINT "DoctorNoteFile_doctorNoteId_fkey" FOREIGN KEY ("doctorNoteId") REFERENCES "DoctorNote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
