import { fileTypeFromFile } from "file-type";
import { AppError } from "../errors/app.error.js";

export async function validateUploadedDoctorNoteFiles(
  files: Express.Multer.File[],
) {
  const allowedMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  for (const file of files) {
    const allowed = await fileTypeFromFile(file.path);

    if (
      allowed === undefined ||
      !allowedMimeTypes.includes(allowed.mime) ||
      allowed.mime !== file.mimetype
    ) {
      throw new AppError("File type not allowed.", 400, "INVALID_FILE_TYPE");
    }
  }
}
