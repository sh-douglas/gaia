import { unlink } from 'node:fs/promises';

export async function cleanupUploadedFiles(files: Express.Multer.File[]) {
  const filesToCleanUp = files.map(async (file) => {
    try {
      await unlink(file.path);
    } catch (error) {
      console.error(error);
    }
  });
  await Promise.all(filesToCleanUp);
}
