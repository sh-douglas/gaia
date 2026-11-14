import type { Request, Response } from "express";
import doctorNoteService from "../services/doctor-note.service.js";
import { doctorNoteParamsSchema } from "../validators/doctor-note.validator.js";

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
}

export default new DoctorNoteController();
