import type { Request, Response } from "express";
import authService from "../services/auth.service.js";

class AuthController {
  async signIn(req: Request, res: Response) {
    const employee = await authService.signIn(req.body);

    return res.status(200).json(employee);
  }
}

export default new AuthController();
