import express from 'express';
import * as glumacController from '../controllers/glumacController';

const router = express.Router();

// GET /api/glumci - Preuzmi sve glumce
router.get('/', glumacController.getAllGlumci);

// GET /api/glumci/search?q=query - Pretraži glumce
router.get('/search', glumacController.searchGlumci);

// GET /api/glumci/ime/:ime - Preuzmi glumca po imenu (mora biti PRE /:id da ne bi bio prepoznat kao ID)
router.get('/ime/:ime', glumacController.getGlumacByIme);

// GET /api/glumci/:ime/filmovi - Preuzmi filmove glumca
router.get('/:ime/filmovi', glumacController.getFilmoviZaGlumca);

// GET /api/glumci/:ime/statistike - Preuzmi statistike glumca
router.get('/:ime/statistike', glumacController.getStatistikeGlumca);

// GET /api/glumci/:id - Preuzmi glumca po ID-u
router.get('/:id', glumacController.getGlumacById);

// POST /api/glumci - Kreiraj novog glumca
router.post('/', glumacController.createGlumac);

// PUT /api/glumci/:id - Ažuriraj glumca
router.put('/:id', glumacController.updateGlumac);

// DELETE /api/glumci/:id - Obriši glumca
router.delete('/:id', glumacController.deleteGlumac);

export default router;
