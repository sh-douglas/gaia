import { open } from 'node:fs/promises';
import { constants } from 'node:fs';
import { AppError } from '../errors/app.error.js';

export async function openDoctorNoteFile(filePath: string) {
  let fileHandle;
  try {
    fileHandle = await open(
      filePath,
      constants.O_RDONLY | constants.O_NOFOLLOW,
    );
  } catch (error) {
    if (
      error instanceof Error &&
      'code' in error &&
      (error.code === 'ENOENT' || error.code === 'ELOOP')
    ) {
      throw new AppError(
        'Doctor note file not found.',
        404,
        'DOCTOR_NOTE_FILE_NOT_FOUND',
      );
    }

    throw error;
  }
  try {
    const stats = await fileHandle.stat();

    if (!stats.isFile()) {
      throw new AppError(
        'Doctor note file not found.',
        404,
        'DOCTOR_NOTE_FILE_NOT_FOUND',
      );
    }

    return fileHandle;
  } catch (error) {
    await fileHandle.close();
    throw error;
  }
}
