import app from "./app.js";
import { env } from "./config/env.js";
import { mkdir } from "node:fs/promises";
import { DOCTOR_NOTE_ORIGINALS_DIR } from "./config/storage.js";

const PORT = env.PORT;

async function start() {
  try {
    await mkdir(DOCTOR_NOTE_ORIGINALS_DIR, { recursive: true });
    app.listen(PORT, () => {
      console.log(`App is running on ${PORT} port`);
    });
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

start();
