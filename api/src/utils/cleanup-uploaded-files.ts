import { unlink } from "node:fs/promises";

export async function cleanupUploadedFiles(files: Express.Multer.File[]) {
  for (const file of files) {
    try {
      await unlink(file.path);
    } catch (error) {
      console.error(error);
    }
  }
}
