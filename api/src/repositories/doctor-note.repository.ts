import { prisma } from "../lib/prisma.js";

interface DoctorNoteFileCreateData {
  originalFile: string;
  optimizedFile?: string;
}

interface DoctorNoteCreateData {
  issuedAt: Date;
  restDays: number;
  doctorName: string;
  crm: string;
  clinic: string;
  noteType: string;
  cid: string;
  observation?: string | undefined;
  employeeId: string;
  submittedAt: Date;
  restEndsAt: Date;
  files: DoctorNoteFileCreateData[];
}

class DoctorNoteRepository {
  async create(data: DoctorNoteCreateData) {
    return prisma.doctorNote.create({
      data: {
        issuedAt: data.issuedAt,
        restDays: data.restDays,
        doctorName: data.doctorName,
        crm: data.crm,
        clinic: data.clinic,
        noteType: data.noteType,
        cid: data.cid,
        ...(data.observation !== undefined && {
          observation: data.observation,
        }),
        employeeId: data.employeeId,
        submittedAt: data.submittedAt,
        restEndsAt: data.restEndsAt,
        doctorNoteFile: {
          create: data.files,
        },
      },
    });
  }
}

export default new DoctorNoteRepository();
