import path from "node:path";
import { DOCTOR_NOTE_ORIGINALS_DIR } from "../config/storage.js";
import { AppError } from "../errors/app.error.js";

export function resolveDoctorNoteFilePath(fileName: string) {
  if (
    !fileName ||
    fileName === "." ||
    fileName === ".." ||
    path.basename(fileName) !== fileName
  ) {
    throw new AppError(
      "Doctor note file not found.",
      404,
      "DOCTOR_NOTE_FILE_NOT_FOUND",
    );
  }

  const baseDir = path.resolve(DOCTOR_NOTE_ORIGINALS_DIR);
  const resolvedPath = path.resolve(baseDir, fileName);

  const relativePath = path.relative(baseDir, resolvedPath);

  if (
    relativePath === ".." ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  ) {
    throw new AppError(
      "Doctor note file not found.",
      404,
      "DOCTOR_NOTE_FILE_NOT_FOUND",
    );
  }

  return resolvedPath;
}
