"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCommentByUsername = exports.addRatingByUsername = exports.deleteFilm = exports.updateFilm = exports.getNewestFilms = exports.getTopRatedFilms = exports.getFilmsByActor = exports.getFilmsByDirector = exports.checkAvailability = exports.rentFilmByUsername = exports.rentFilm = exports.addComment = exports.addRating = exports.getSimilarFilms = exports.getFilmsByGenre = exports.searchFilms = exports.createFilm = exports.getFilmById = exports.getAllFilms = void 0;
const film_1 = __importDefault(require("../models/film"));
const iznajmljivanje_1 = __importDefault(require("../models/iznajmljivanje"));
// Preuzmi sve filmove
const getAllFilms = async (req, res) => {
    try {
        const films = await film_1.default.find().sort({ naslov: 1 }); // Sortirano po naslovu
        res.status(200).json({
            success: true,
            count: films.length,
            data: films
        });
    }
    catch (error) {
        console.error('❌ Greška pri preuzimanju filmova:', error);
        res.status(500).json({
            success: false,
            message: 'Došlo je do greške pri preuzimanju filmova!',
            error: error.message
        });
    }
};
exports.getAllFilms = getAllFilms;
// Preuzmi film po ID-u
const getFilmById = async (req, res) => {
    try {
        const { id } = req.params;
        const film = await film_1.default.findById(id);
        if (!film) {
            res.status(404).json({
                success: false,
                message: 'Film nije pronađen!'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: film
        });
    }
    catch (error) {
        console.error('❌ Greška pri preuzimanju filma:', error);
        res.status(500).json({
            success: false,
            message: 'Došlo je do greške pri preuzimanju filma!',
            error: error.message
        });
    }
};
exports.getFilmById = getFilmById;
// POST /api/films - Kreiraj novi film (admin only)
const createFilm = async (req, res) => {
    try {
        const filmData = req.body;
        // Validacija obaveznih polja
        if (!filmData.naslov || !filmData.zanr || filmData.zanr.length === 0) {
            res.status(400).json({
                success: false,
                message: 'Naslov i žanr su obavezni!'
            });
            return;
        }
        // Kreiraj novi film
        const newFilm = new film_1.default(filmData);
        await newFilm.save();
        console.log('✅ Novi film kreiran:', newFilm.naslov);
        res.status(201).json({
            success: true,
            message: 'Film uspešno kreiran!',
            data: newFilm
        });
    }
    catch (error) {
        console.error('❌ Greška pri kreiranju filma:', error);
        res.status(500).json({
            success: false,
            message: 'Došlo je do greške pri kreiranju filma!',
            error: error.message
        });
    }
};
exports.createFilm = createFilm;
// Pretraži filmove po naslovu
const searchFilms = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || typeof q !== 'string') {
            res.status(400).json({
                success: false,
                message: 'Query parametar je obavezan!'
            });
            return;
        }
        const films = await film_1.default.find({
            naslov: { $regex: q, $options: 'i' } // Case-insensitive pretraga
        }).sort({ naslov: 1 });
        res.status(200).json({
            success: true,
            count: films.length,
            data: films
        });
    }
    catch (error) {
        console.error('❌ Greška pri pretrazi filmova:', error);
        res.status(500).json({
            success: false,
            message: 'Došlo je do greške pri pretrazi filmova!',
            error: error.message
        });
    }
};
exports.searchFilms = searchFilms;
// Preuzmi filmove po žanru
const getFilmsByGenre = async (req, res) => {
    try {
        const { zanr } = req.params;
        const films = await film_1.default.find({
            zanr: { $in: [zanr] }
        }).sort({ naslov: 1 });
        res.status(200).json({
            success: true,
            count: films.length,
            data: films
        });
    }
    catch (error) {
        console.error('❌ Greška pri preuzimanju filmova po žanru:', error);
        res.status(500).json({
            success: false,
            message: 'Došlo je do greške pri preuzimanju filmova!',
            error: error.message
        });
    }
};
exports.getFilmsByGenre = getFilmsByGenre;
// Preuzmi slične filmove (KNN algoritam)
const getSimilarFilms = async (req, res) => {
    try {
        const { id } = req.params;
        const limit = parseInt(req.query.limit) || 6;
        const film = await film_1.default.findById(id);
        if (!film) {
            res.status(404).json({
                success: false,
                message: 'Film nije pronađen!'
            });
            return;
        }
        // Pronađi filmove sa istim žanrovima ili režiserima
        const similarFilms = await film_1.default.find({
            _id: { $ne: id }, // Isključi trenutni film
            $or: [
                { zanr: { $in: film.zanr } },
                { reziser: { $in: film.reziser } }
            ]
        }).limit(limit);
        res.status(200).json({
            success: true,
            count: similarFilms.length,
            data: similarFilms
        });
    }
    catch (error) {
        console.error('❌ Greška pri preuzimanju sličnih filmova:', error);
        res.status(500).json({
            success: false,
            message: 'Došlo je do greške pri preuzimanju sličnih filmova!',
            error: error.message
        });
    }
};
exports.getSimilarFilms = getSimilarFilms;
// Dodaj ocenu filmu
const addRating = async (req, res) => {
    try {
        const { id } = req.params;
        const { korisnikId, ocena } = req.body;
        if (!korisnikId || !ocena) {
            res.status(400).json({
                success: false,
                message: 'Korisnik ID i ocena su obavezni!'
            });
            return;
        }
        const film = await film_1.default.findById(id);
        if (!film) {
            res.status(404).json({
                success: false,
                message: 'Film nije pronađen!'
            });
            return;
        }
        // Dodaj ocenu
        film.ocene.push({
            korisnikId,
            vrednost: ocena,
            datum: new Date()
        });
        await film.save();
        res.status(200).json({
            success: true,
            message: 'Ocena je uspešno dodata!',
            data: film
        });
    }
    catch (error) {
        console.error('❌ Greška pri dodavanju ocene:', error);
        res.status(500).json({
            success: false,
            message: 'Došlo je do greške pri dodavanju ocene!',
            error: error.message
        });
    }
};
exports.addRating = addRating;
// Dodaj komentar filmu
const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { korisnikId, tekst, ocena } = req.body;
        if (!korisnikId || !tekst) {
            res.status(400).json({
                success: false,
                message: 'Korisnik ID i tekst komentara su obavezni!'
            });
            return;
        }
        const film = await film_1.default.findById(id);
        if (!film) {
            res.status(404).json({
                success: false,
                message: 'Film nije pronađen!'
            });
            return;
        }
        // Dodaj komentar
        film.komentari.push({
            korisnikId,
            tekst,
            ocena: ocena || null,
            datum: new Date()
        });
        await film.save();
        res.status(200).json({
            success: true,
            message: 'Komentar je uspešno dodat!',
            data: film
        });
    }
    catch (error) {
        console.error('❌ Greška pri dodavanju komentara:', error);
        res.status(500).json({
            success: false,
            message: 'Došlo je do greške pri dodavanju komentara!',
            error: error.message
        });
    }
};
exports.addComment = addComment;
// Iznajmi film
const rentFilm = async (req, res) => {
    try {
        const { id } = req.params;
        const { korisnikId, datumPocetka, datumZavrsetka } = req.body;
        if (!korisnikId || !datumPocetka || !datumZavrsetka) {
            res.status(400).json({
                success: false,
                message: 'Svi podaci su obavezni!'
            });
            return;
        }
        const film = await film_1.default.findById(id);
        if (!film) {
            res.status(404).json({
                success: false,
                message: 'Film nije pronađen!'
            });
            return;
        }
        // Izračunaj broj aktivnih iznajmljivanja za ovaj film
        const activeRentals = await iznajmljivanje_1.default.countDocuments({
            'film._id': film._id.toString(),
            datumVracanja: { $gt: new Date() }
        });
        const available = film.ukupnoKomada - activeRentals;
        if (available <= 0) {
            res.status(400).json({
                success: false,
                message: 'Film trenutno nije dostupan!'
            });
            return;
        }
        // Kreiraj iznajmljivanje
        const iznajmljivanje = new iznajmljivanje_1.default({
            filmId: id,
            korisnikId,
            datumPocetka: new Date(datumPocetka),
            datumZavrsetka: new Date(datumZavrsetka),
            status: 'aktivno'
        });
        await iznajmljivanje.save();
        // (Više se ne smanjuje dostupnoKomada, samo se kreira iznajmljivanje)
        res.status(200).json({
            success: true,
            message: 'Film je uspešno iznajmljen!',
            data: iznajmljivanje
        });
    }
    catch (error) {
        console.error('❌ Greška pri iznajmljivanju filma:', error);
        res.status(500).json({
            success: false,
            message: 'Došlo je do greške pri iznajmljivanju filma!',
            error: error.message
        });
    }
};
exports.rentFilm = rentFilm;
// POST /api/films/:id/iznajmi/byusername - Iznajmi film korišćenjem username
const rentFilmByUsername = async (req, res) => {
    try {
        const { id } = req.params;
        const { korisnik, datumPocetka, datumZavrsetka, brojDana, ukupnaCena, brojKartice } = req.body;
        if (!korisnik || !datumPocetka || !datumZavrsetka || !brojDana || !ukupnaCena || !brojKartice) {
            res.status(400).json({
                success: false,
                message: 'Svi podaci su obavezni!'
            });
            return;
        }
        const film = await film_1.default.findById(id);
        if (!film) {
            res.status(404).json({
                success: false,
                message: 'Film nije pronađen!'
            });
            return;
        }
        // Izračunaj broj aktivnih iznajmljivanja za ovaj film
        const activeRentals = await iznajmljivanje_1.default.countDocuments({
            'film._id': film._id.toString(),
            datumVracanja: { $gt: new Date() }
        });
        const available = film.ukupnoKomada - activeRentals;
        if (available <= 0) {
            res.status(400).json({
                success: false,
                message: 'Film trenutno nije dostupan!'
            });
            return;
        }
        // Proveri da li već postoji iznajmljivanje za ovog korisnika i film u preklapajućem periodu
        const datumPocetkaDate = new Date(datumPocetka);
        const datumZavrsetkaDate = new Date(datumZavrsetka);
        const overlapping = await iznajmljivanje_1.default.findOne({
            'korisnik': korisnik,
            'film._id': film._id.toString(),
            $or: [
                {
                    // Novi period počinje tokom postojećeg iznajmljivanja
                    datumIznajmljivanja: { $lte: datumPocetkaDate },
                    datumVracanja: { $gt: datumPocetkaDate }
                },
                {
                    // Novi period završava tokom postojećeg iznajmljivanja
                    datumIznajmljivanja: { $lt: datumZavrsetkaDate },
                    datumVracanja: { $gte: datumZavrsetkaDate }
                },
                {
                    // Novi period potpuno obuhvata postojeće iznajmljivanje
                    datumIznajmljivanja: { $gte: datumPocetkaDate },
                    datumVracanja: { $lte: datumZavrsetkaDate }
                }
            ]
        });
        if (overlapping) {
            res.status(400).json({
                success: false,
                message: 'Već postoji iznajmljivanje za ovaj film u izabranom periodu!'
            });
            return;
        }
        // Kreiraj iznajmljivanje sa strukturom koja odgovara modelu
        const iznajmljivanje = new iznajmljivanje_1.default({
            korisnik: korisnik,
            film: {
                _id: film._id.toString(),
                naslov: film.naslov,
                poster: film.poster,
                zanr: film.zanr
            },
            datumIznajmljivanja: new Date(datumPocetka),
            datumVracanja: new Date(datumZavrsetka),
            brojKartice: brojKartice,
            cenaDnevno: film.cenaDnevno,
            ukupnaCena: ukupnaCena,
            brojDana: brojDana
        });
        await iznajmljivanje.save();
        // (Više se ne smanjuje dostupnoKomada, samo se kreira iznajmljivanje)
        res.status(200).json({
            success: true,
            message: 'Film je uspešno iznajmljen!',
            data: iznajmljivanje
        });
    }
    catch (error) {
        console.error('❌ Greška pri iznajmljivanju filma:', error);
        res.status(500).json({
            success: false,
            message: 'Došlo je do greške pri iznajmljivanju filma!',
            error: error.message
        });
    }
};
exports.rentFilmByUsername = rentFilmByUsername;
// Proveri dostupnost filma
const checkAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const film = await film_1.default.findById(id);
        if (!film) {
            res.status(404).json({
                success: false,
                message: 'Film nije pronađen!'
            });
            return;
        }
        // Izračunaj broj aktivnih iznajmljivanja za ovaj film
        const activeRentals = await iznajmljivanje_1.default.countDocuments({
            'film._id': film._id.toString(),
            datumVracanja: { $gt: new Date() }
        });
        const available = film.ukupnoKomada - activeRentals;
        res.status(200).json({
            success: true,
            available: available > 0,
            count: available
        });
    }
    catch (error) {
        console.error('❌ Greška pri proveri dostupnosti:', error);
        res.status(500).json({
            success: false,
            message: 'Došlo je do greške pri proveri dostupnosti!',
            error: error.message
        });
    }
};
exports.checkAvailability = checkAvailability;
// Preuzmi filmove po režiseru
const getFilmsByDirector = async (req, res) => {
    try {
        const { reziser } = req.params;
        const films = await film_1.default.find({
            reziser: { $in: [reziser] }
        }).sort({ godina: -1 });
        res.status(200).json({
            success: true,
            count: films.length,
            data: films
        });
    }
    catch (error) {
        console.error('❌ Greška pri preuzimanju filmova po režiseru:', error);
        res.status(500).json({
            success: false,
            message: 'Došlo je do greške pri preuzimanju filmova!',
            error: error.message
        });
    }
};
exports.getFilmsByDirector = getFilmsByDirector;
// Preuzmi filmove po glumcu
const getFilmsByActor = async (req, res) => {
    try {
        const { glumac } = req.params;
        const films = await film_1.default.find({
            glumci: { $in: [glumac] }
        }).sort({ godina: -1 });
        res.status(200).json({
            success: true,
            count: films.length,
            data: films
        });
    }
    catch (error) {
        console.error('❌ Greška pri preuzimanju filmova po glumcu:', error);
        res.status(500).json({
            success: false,
            message: 'Došlo je do greške pri preuzimanju filmova!',
            error: error.message
        });
    }
};
exports.getFilmsByActor = getFilmsByActor;
// Preuzmi najbolje ocenjene filmove
const getTopRatedFilms = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const films = await film_1.default.find({
            ocene: { $exists: true, $ne: [] }
        });
        // Izračunaj prosečne ocene i sortiraj
        const filmsWithAverage = films.map(film => {
            const sum = film.ocene.reduce((acc, ocena) => {
                return acc + (typeof ocena === 'number' ? ocena : ocena.vrednost || 0);
            }, 0);
            const average = film.ocene.length > 0 ? sum / film.ocene.length : 0;
            return {
                ...film.toObject(),
                averageRating: average
            };
        });
        filmsWithAverage.sort((a, b) => b.averageRating - a.averageRating);
        res.status(200).json({
            success: true,
            count: filmsWithAverage.slice(0, limit).length,
            data: filmsWithAverage.slice(0, limit)
        });
    }
    catch (error) {
        console.error('❌ Greška pri preuzimanju top filmova:', error);
        res.status(500).json({
            success: false,
            message: 'Došlo je do greške pri preuzimanju top filmova!',
            error: error.message
        });
    }
};
exports.getTopRatedFilms = getTopRatedFilms;
// Preuzmi najnovije filmove
const getNewestFilms = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const films = await film_1.default.find()
            .sort({ godina: -1 })
            .limit(limit);
        res.status(200).json({
            success: true,
            count: films.length,
            data: films
        });
    }
    catch (error) {
        console.error('❌ Greška pri preuzimanju najnovijih filmova:', error);
        res.status(500).json({
            success: false,
            message: 'Došlo je do greške pri preuzimanju najnovijih filmova!',
            error: error.message
        });
    }
};
exports.getNewestFilms = getNewestFilms;
// PUT /api/films/:id - Ažuriraj film (admin only)
const updateFilm = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // Pronađi film
        const film = await film_1.default.findById(id);
        if (!film) {
            res.status(404).json({
                success: false,
                message: 'Film nije pronađen!'
            });
            return;
        }
        // Validacija - proveri da li dostupnoKomada ne prelazi ukupnoKomada
        if (updateData.dostupnoKomada !== undefined && updateData.ukupnoKomada !== undefined) {
            if (updateData.dostupnoKomada > updateData.ukupnoKomada) {
                res.status(400).json({
                    success: false,
                    message: 'Dostupno komada ne može biti veće od ukupnog broja komada!'
                });
                return;
            }
        }
        // Ažuriraj film
        const updatedFilm = await film_1.default.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
        res.status(200).json({
            success: true,
            message: 'Film uspešno ažuriran!',
            data: updatedFilm
        });
    }
    catch (error) {
        console.error('❌ Greška pri ažuriranju filma:', error);
        res.status(500).json({
            success: false,
            message: 'Došlo je do greške pri ažuriranju filma!',
            error: error.message
        });
    }
};
exports.updateFilm = updateFilm;
// DELETE /api/films/:id - Obriši film (admin only)
const deleteFilm = async (req, res) => {
    try {
        const { id } = req.params;
        // Proveri da li film postoji
        const film = await film_1.default.findById(id);
        if (!film) {
            res.status(404).json({
                success: false,
                message: 'Film nije pronađen!'
            });
            return;
        }
        // Proveri da li postoje aktivna iznajmljivanja za ovaj film
        const aktivnaIznajmljivanja = await iznajmljivanje_1.default.find({
            film: id,
            status: 'aktivno'
        });
        if (aktivnaIznajmljivanja.length > 0) {
            res.status(400).json({
                success: false,
                message: `Ne možete obrisati film jer postoji ${aktivnaIznajmljivanja.length} aktivnih iznajmljivanja!`
            });
            return;
        }
        // Obriši film
        await film_1.default.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: 'Film uspešno obrisan!'
        });
    }
    catch (error) {
        console.error('❌ Greška pri brisanju filma:', error);
        res.status(500).json({
            success: false,
            message: 'Došlo je do greške pri brisanju filma!',
            error: error.message
        });
    }
};
exports.deleteFilm = deleteFilm;
// POST /api/films/:id/ocene/byusername - Dodaj ocenu filmu korišćenjem username
const addRatingByUsername = async (req, res) => {
    try {
        const { id } = req.params;
        const { korisnik, vrednost } = req.body;
        if (!korisnik || !vrednost) {
            res.status(400).json({
                success: false,
                message: 'Korisnik i vrednost su obavezni!'
            });
            return;
        }
        const film = await film_1.default.findById(id);
        if (!film) {
            res.status(404).json({
                success: false,
                message: 'Film nije pronađen!'
            });
            return;
        }
        // Proveri da li je korisnik već ocenio film
        const existingRating = film.ocene.find((o) => o.korisnik === korisnik);
        if (existingRating) {
            res.status(400).json({
                success: false,
                message: 'Korisnik je već ocenio ovaj film!'
            });
            return;
        }
        // Dodaj ocenu
        film.ocene.push({
            korisnik,
            ocena: vrednost,
            datum: new Date()
        });
        await film.save();
        res.status(200).json({
            success: true,
            message: 'Ocena je uspešno dodata!',
            data: film
        });
    }
    catch (error) {
        console.error('❌ Greška pri dodavanju ocene:', error);
        res.status(500).json({
            success: false,
            message: 'Došlo je do greške pri dodavanju ocene!',
            error: error.message
        });
    }
};
exports.addRatingByUsername = addRatingByUsername;
// POST /api/films/:id/komentari/byusername - Dodaj komentar filmu korišćenjem username
const addCommentByUsername = async (req, res) => {
    try {
        const { id } = req.params;
        const { korisnik, tekst } = req.body;
        if (!korisnik || !tekst) {
            res.status(400).json({
                success: false,
                message: 'Korisnik i tekst komentara su obavezni!'
            });
            return;
        }
        const film = await film_1.default.findById(id);
        if (!film) {
            res.status(404).json({
                success: false,
                message: 'Film nije pronađen!'
            });
            return;
        }
        // Dodaj komentar
        film.komentari.push({
            korisnik,
            tekst,
            datum: new Date()
        });
        await film.save();
        res.status(200).json({
            success: true,
            message: 'Komentar je uspešno dodat!',
            data: film
        });
    }
    catch (error) {
        console.error('❌ Greška pri dodavanju komentara:', error);
        res.status(500).json({
            success: false,
            message: 'Došlo je do greške pri dodavanju komentara!',
            error: error.message
        });
    }
};
exports.addCommentByUsername = addCommentByUsername;
//# sourceMappingURL=filmController.js.map