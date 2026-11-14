import type { Request, Response } from "express";
import doctorNoteService from "../services/doctor-note.service.js";
import {
  doctorNoteParamsSchema,
  downloadDoctorNoteFileParamsSchema,
} from "../validators/doctor-note.validator.js";
import { openDoctorNoteFile } from "../utils/open-doctor-notes-files.js";
import { pipeline } from "node:stream/promises";
import path from "node:path";

class DoctorNoteController {
  async create(req: Request, res: Response) {
    const files = Array.isArray(req.files) ? req.files : [];
    const doctorNote = await doctorNoteService.create(
      req.body,
      req.employeeId,
      files,
    );

    return res.status(201).json(doctorNote);
  }

  async findManyByEmployeeId(req: Request, res: Response) {
    const doctorNotes = await doctorNoteService.findManyByEmployeeId(
      req.employeeId,
    );

    return res.status(200).json(doctorNotes);
  }

  async findByIdAndEmployeeId(req: Request, res: Response) {
    const parsedParams = doctorNoteParamsSchema.parse(req.params);
    const doctorNote = await doctorNoteService.findByIdAndEmployeeId(
      parsedParams.id,
      req.employeeId,
    );

    return res.status(200).json(doctorNote);
  }

  async downloadFile(req: Request, res: Response) {
    const parsedParams = downloadDoctorNoteFileParamsSchema.parse(req.params);
    const { id, fileId } = parsedParams;
    const doctorNoteFile =
      await doctorNoteService.findFileByIdAndDoctorNoteIdAndEmployeeId(
        fileId,
        id,
        req.employeeId,
      );

    const fileHandle = await openDoctorNoteFile(doctorNoteFile.filePath);
    const stream = fileHandle.createReadStream();
    const extension = path.extname(doctorNoteFile.filePath);
    res.attachment(`atestado${extension}`);
    res.setHeader("Cache-Control", "no-store");
    await pipeline(stream, res);
  }
}

export default new DoctorNoteController();
