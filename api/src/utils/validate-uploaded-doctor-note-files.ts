import { fileTypeFromFile } from "file-type";
import { AppError } from "../errors/app.error.js";
import path from "node:path";

export async function validateUploadedDoctorNoteFiles(
  files: Express.Multer.File[],
) {
  const allowedMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  const allowedMap: Record<string, string[]> = {
    "application/pdf": [".pdf"],
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/webp": [".webp"],
  };

  for (const file of files) {
    const allowed = await fileTypeFromFile(file.path);

    if (
      allowed === undefined ||
      !allowedMimeTypes.includes(allowed.mime) ||
      allowed.mime !== file.mimetype
    ) {
      throw new AppError("File type not allowed.", 400, "INVALID_FILE_TYPE");
    }

    const extension = path.extname(file.filename).toLocaleLowerCase();
    const allowedExtesions = allowedMap[allowed.mime];

    if (allowedExtesions === undefined) {
      throw new AppError("File type not allowed.", 400, "INVALID_FILE_TYPE");
    }

    if (!allowedExtesions.includes(extension)) {
      throw new AppError("File type not allowed.", 400, "INVALID_FILE_TYPE");
    }
  }
}
