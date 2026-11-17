import { Router } from 'express';
import { loginRateLimiter } from '../middlewares/login-rate-limit.middleware.js';
import authController from '../controllers/auth.controller.js';
import { ensureAuthenticated } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', loginRateLimiter, authController.signIn);
router.post('/logout', ensureAuthenticated, authController.signOut);

export default router;
