import { Router } from 'express';
import * as authController from '../controllers/authController';

const router = Router();

/**
 * Auth Routes
 * Base path: /api/auth
 */

// POST /api/auth/login/korisnik - Login običnog korisnika
router.post('/login/korisnik', authController.loginKorisnik);

// POST /api/auth/login/admin - Login admina
router.post('/login/admin', authController.loginAdmin);

// POST /api/auth/logout - Logout
router.post('/logout', authController.logout);

export default router;
