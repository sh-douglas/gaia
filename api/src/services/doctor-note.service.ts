import holidayService from "./holiday.service.js";
import doctorNoteRepository from "../repositories/doctor-note.repository.js";
import { AppError } from "../errors/app.error.js";
import { createDoctorNoteSchema } from "../validators/doctor-note.validator.js";
import { calculateBusinessDeadline } from "../utils/calculate-business-deadline.js";

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
    const holidays = await holidayService.getHolidaysForDeadline(
      parsedData.issuedAt,
    );
    const limitDate = calculateBusinessDeadline(
      parsedData.issuedAt,
      3,
      holidays,
    );

    if (submittedAt > limitDate) {
      throw new AppError(
        "The doctor note submission deadline has expired.",
        400,
        "DOCTOR_NOTE_DEADLINE_EXPIRED",
      );
    }

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
