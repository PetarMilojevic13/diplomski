"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const filmController = __importStar(require("../controllers/filmController"));
const router = express_1.default.Router();
// GET /api/filmovi - Preuzmi sve filmove
router.get('/', filmController.getAllFilms);
// GET /api/filmovi/:id - Preuzmi film po ID-u
router.get('/:id', filmController.getFilmById);
// POST /api/filmovi - Kreiraj novi film (admin)
router.post('/', filmController.createFilm);
// GET /api/filmovi/pretraga?q=query - Pretraži filmove po naslovu
router.get('/pretraga', filmController.searchFilms);
// GET /api/filmovi/zanr/:zanr - Preuzmi filmove po žanru
router.get('/zanr/:zanr', filmController.getFilmsByGenre);
// GET /api/filmovi/:id/slicni?limit=6 - Preuzmi slične filmove (KNN)
router.get('/:id/slicni', filmController.getSimilarFilms);
// POST /api/filmovi/:id/ocene - Dodaj ocenu filmu
router.post('/:id/ocene', filmController.addRating);
// POST /api/filmovi/:id/ocene/byusername - Dodaj ocenu filmu korišćenjem username
router.post('/:id/ocene/byusername', filmController.addRatingByUsername);
// POST /api/filmovi/:id/komentari - Dodaj komentar filmu
router.post('/:id/komentari', filmController.addComment);
// POST /api/filmovi/:id/komentari/byusername - Dodaj komentar filmu korišćenjem username
router.post('/:id/komentari/byusername', filmController.addCommentByUsername);
// POST /api/filmovi/:id/iznajmi - Iznajmi film
router.post('/:id/iznajmi', filmController.rentFilm);
// POST /api/filmovi/:id/iznajmi/byusername - Iznajmi film korišćenjem username
router.post('/:id/iznajmi/byusername', filmController.rentFilmByUsername);
// GET /api/filmovi/:id/dostupnost - Proveri dostupnost filma
router.get('/:id/dostupnost', filmController.checkAvailability);
// GET /api/filmovi/reziser/:reziser - Preuzmi filmove po režiseru
router.get('/reziser/:reziser', filmController.getFilmsByDirector);
// GET /api/filmovi/glumac/:glumac - Preuzmi filmove po glumcu
router.get('/glumac/:glumac', filmController.getFilmsByActor);
// GET /api/filmovi/top-rated?limit=10 - Preuzmi najbolje ocenjene filmove
router.get('/top-rated', filmController.getTopRatedFilms);
// GET /api/filmovi/newest?limit=10 - Preuzmi najnovije filmove
router.get('/newest', filmController.getNewestFilms);
// PUT /api/filmovi/:id - Ažuriraj film (admin)
router.put('/:id', filmController.updateFilm);
// DELETE /api/filmovi/:id - Obriši film (admin)
router.delete('/:id', filmController.deleteFilm);
exports.default = router;
//# sourceMappingURL=filmRoutes.js.map