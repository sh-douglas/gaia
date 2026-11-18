import { fileTypeFromFile } from 'file-type';
import { AppError } from '../errors/app.error.js';
import path from 'node:path';
import {
  allowedDoctorNoteExtensions,
  allowedDoctorNoteMimeTypes,
} from '../config/doctor-note-file-types.js';

export async function validateUploadedDoctorNoteFiles(
  files: Express.Multer.File[],
) {
  for (const file of files) {
    // oxlint-disable-next-line no-await-in-loop
    const allowed = await fileTypeFromFile(file.path);

    if (
      allowed === undefined ||
      !allowedDoctorNoteMimeTypes.has(allowed.mime) ||
      allowed.mime !== file.mimetype
    ) {
      throw new AppError('File type not allowed.', 400, 'INVALID_FILE_TYPE');
    }

    const extension = path.extname(file.filename).toLowerCase();
    const allowedExtensions = allowedDoctorNoteExtensions[allowed.mime];

    if (allowedExtensions === undefined) {
      throw new AppError('File type not allowed.', 400, 'INVALID_FILE_TYPE');
    }

    if (!allowedExtensions.includes(extension)) {
      throw new AppError('File type not allowed.', 400, 'INVALID_FILE_TYPE');
    }
  }
}
