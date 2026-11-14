import { lstat } from "node:fs/promises";
import { AppError } from "../errors/app.error.js";

export async function validateDoctorNoteFile(filePath: string) {
  try {
    const stat = await lstat(filePath);

    if (!stat.isFile()) {
      throw new AppError(
        "Doctor note file not found.",
        404,
        "DOCTOR_NOTE_FILE_NOT_FOUND",
      );
    }
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw new AppError(
        "Doctor note file not found.",
        404,
        "DOCTOR_NOTE_FILE_NOT_FOUND",
      );
    }

    throw error;
  }
}
