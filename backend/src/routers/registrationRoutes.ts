import { Router } from 'express';
import * as registrationController from '../controllers/registrationController';

const router = Router();

/**
 * Registration Routes
 * Base path: /api/registration
 */

// POST /api/registration/register - Registracija novog korisnika
router.post('/register', registrationController.registerKorisnik);

// GET /api/registration/check-username/:username - Provera dostupnosti korisničkog imena
router.get('/check-username/:username', registrationController.checkUsernameAvailability);

// GET /api/registration/check-email/:email - Provera dostupnosti email-a
router.get('/check-email/:email', registrationController.checkEmailAvailability);

// ADMIN ROUTES
// GET /api/registration/admin/requests - Get all registration requests
router.get('/admin/requests', registrationController.getAllRegistrationRequests);

// GET /api/registration/admin/pending - Get pending registration requests
router.get('/admin/pending', registrationController.getPendingRegistrationRequests);

// POST /api/registration/admin/approve/:requestId - Approve registration request
router.post('/admin/approve/:requestId', registrationController.approveRegistrationRequest);

// POST /api/registration/admin/reject/:requestId - Reject registration request
router.post('/admin/reject/:requestId', registrationController.rejectRegistrationRequest);

export default router;
