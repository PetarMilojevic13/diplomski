import express from 'express';
import * as iznajmljivanjeController from '../controllers/iznajmljivanjeController';

const router = express.Router();

// GET /api/iznajmljivanja - Get all rentals (admin)
router.get('/', iznajmljivanjeController.getAllIznajmljivanja);

// GET /api/iznajmljivanja/korisnik/:kor_ime - Get all rentals for specific user
router.get('/korisnik/:kor_ime', iznajmljivanjeController.getIznajmljivanjaByKorisnik);

// GET /api/iznajmljivanja/aktivna/:kor_ime - Get only active rentals for user
router.get('/aktivna/:kor_ime', iznajmljivanjeController.getAktivnaIznajmljivanja);

// GET /api/iznajmljivanja/statistika/:kor_ime - Get rental statistics for user
router.get('/statistika/:kor_ime', iznajmljivanjeController.getStatistikaIznajmljivanja);

// GET /api/iznajmljivanja/admin/statistics - Get rental statistics for admin
router.get('/admin/statistics', iznajmljivanjeController.getRentalStatisticsAdmin);

// GET /api/iznajmljivanja/admin/monthly-trends - Get monthly rental trends
router.get('/admin/monthly-trends', iznajmljivanjeController.getMonthlyRentalTrends);

// POST /api/iznajmljivanja - Create new rental
router.post('/', iznajmljivanjeController.createIznajmljivanje);

// POST /api/iznajmljivanja/check-conflict - Check for rental conflicts
router.post('/check-conflict', iznajmljivanjeController.checkRentalConflict);

// PUT /api/iznajmljivanja/:id/vrati - Return rental
router.put('/:id/vrati', iznajmljivanjeController.vratiIznajmljivanje);

// DELETE /api/iznajmljivanja/:id - Delete rental (admin)
router.delete('/:id', iznajmljivanjeController.deleteIznajmljivanje);

export default router;
