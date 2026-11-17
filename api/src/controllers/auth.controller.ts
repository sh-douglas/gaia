import type { Request, Response } from 'express';
import authService from '../services/auth.service.js';

class AuthController {
  async signIn(req: Request, res: Response) {
    const employee = await authService.signIn(req.body);

    return res.status(200).json(employee);
  }

  async signOut(req: Request, res: Response) {
    await authService.signOut(req.employeeId, req.authSessionId);

    return res.status(204).send();
  }
}

export default new AuthController();
