import { AppError } from "../errors/app.error.js";
import doctorNoteRepository from "../repositories/doctor-note.repository.js";
import {
  createDoctorNoteSchema,
  type CreateDoctorNoteInput,
} from "../validators/doctor-note.validator.js";

class DoctorNoteService {
  private calculateRestEndsAt(issuedAt: Date, restDays: number): Date {
    const issuedAtCopy = new Date(issuedAt);
    const monthlyDay = issuedAtCopy.getDate();
    issuedAtCopy.setDate(monthlyDay + restDays - 1);

    return issuedAtCopy;
  }

  async create(
    data: unknown,
    employeeId: string,
    files: Express.Multer.File[],
  ) {
    if (files.length === 0) {
      throw new AppError(
        "At least one file is required",
        400,
        "DOCTOR_NOTE_FILE_REQUIRED",
      );
    }
    const parsedData = createDoctorNoteSchema.parse(data);

    const submittedAt = new Date();
    const restEndsAt = this.calculateRestEndsAt(
      parsedData.issuedAt,
      parsedData.restDays,
    );
    const doctorNoteFiles = files.map((file) => {
      return {
        originalFile: file.filename,
      };
    });

    const newDoctorNote = await doctorNoteRepository.create({
      ...parsedData,
      employeeId,
      submittedAt,
      restEndsAt,
      files: doctorNoteFiles,
    });

    return newDoctorNote;
  }
}

export default new DoctorNoteService();
