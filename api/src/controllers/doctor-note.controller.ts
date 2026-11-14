import type { Request, Response } from "express";
import doctorNoteService from "../services/doctor-note.service.js";

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
}

export default new DoctorNoteController();
