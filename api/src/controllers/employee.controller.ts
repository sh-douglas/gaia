import type { Request, Response } from "express";
import employeeService from "../services/employee.service.js";

class EmployeeController {
  async create(req: Request, res: Response) {
    const employee = await employeeService.create(req.body);

    return res.status(201).json(employee);
  }

  async findMe(req: Request, res: Response) {
    const employee = await employeeService.findMe(req.employeeId);

    return res.status(200).json(employee);
  }
}

export default new EmployeeController();
