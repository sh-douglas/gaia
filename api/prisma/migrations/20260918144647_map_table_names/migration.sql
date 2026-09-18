/*
  Warnings:

  - You are about to drop the `DoctorNote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DoctorNoteFile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Employee` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DoctorNote" DROP CONSTRAINT "DoctorNote_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorNote" DROP CONSTRAINT "DoctorNote_smoId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorNoteFile" DROP CONSTRAINT "DoctorNoteFile_doctorNoteId_fkey";

-- DropTable
DROP TABLE "DoctorNote";

-- DropTable
DROP TABLE "DoctorNoteFile";

-- DropTable
DROP TABLE "Employee";

-- CreateTable
CREATE TABLE "employees" (
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

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_notes" (
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

    CONSTRAINT "doctor_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_note_files" (
    "id" UUID NOT NULL,
    "originalFile" TEXT NOT NULL,
    "optimizedFile" TEXT NOT NULL,
    "doctorNoteId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctor_note_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_cpf_key" ON "employees"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employees_phone_key" ON "employees"("phone");

-- AddForeignKey
ALTER TABLE "doctor_notes" ADD CONSTRAINT "doctor_notes_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_notes" ADD CONSTRAINT "doctor_notes_smoId_fkey" FOREIGN KEY ("smoId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_note_files" ADD CONSTRAINT "doctor_note_files_doctorNoteId_fkey" FOREIGN KEY ("doctorNoteId") REFERENCES "doctor_notes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
