"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchGlumci = exports.deleteGlumac = exports.updateGlumac = exports.createGlumac = exports.getStatistikeGlumca = exports.getFilmoviZaGlumca = exports.getGlumacByIme = exports.getGlumacById = exports.getAllGlumci = void 0;
const glumac_1 = __importDefault(require("../models/glumac"));
const film_1 = __importDefault(require("../models/film"));
// GET /api/glumci - Preuzmi sve glumce
const getAllGlumci = async (req, res) => {
    try {
        const glumci = await glumac_1.default.find().sort({ ime: 1 });
        res.json({ success: true, data: glumci });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Greška pri preuzimanju glumaca', error: error.message });
    }
};
exports.getAllGlumci = getAllGlumci;
// GET /api/glumci/:id - Preuzmi glumca po ID-u
const getGlumacById = async (req, res) => {
    try {
        const { id } = req.params;
        const glumac = await glumac_1.default.findById(id);
        if (!glumac) {
            return res.status(404).json({ success: false, message: 'Glumac nije pronađen' });
        }
        res.json({ success: true, data: glumac });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Greška pri preuzimanju glumca', error: error.message });
    }
};
exports.getGlumacById = getGlumacById;
// GET /api/glumci/ime/:ime - Preuzmi glumca po imenu
const getGlumacByIme = async (req, res) => {
    try {
        const { ime } = req.params;
        const glumac = await glumac_1.default.findOne({ ime: { $regex: new RegExp(`^${ime}$`, 'i') } });
        if (!glumac) {
            return res.status(404).json({ success: false, message: 'Glumac nije pronađen' });
        }
        res.json({ success: true, data: glumac });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Greška pri preuzimanju glumca', error: error.message });
    }
};
exports.getGlumacByIme = getGlumacByIme;
// GET /api/glumci/:ime/filmovi - Preuzmi sve filmove glumca
const getFilmoviZaGlumca = async (req, res) => {
    try {
        const { ime } = req.params;
        if (!ime) {
            return res.status(400).json({ success: false, message: 'Ime glumca je obavezno' });
        }
        // Dekodiraj ime (može doći URL encoded)
        const dekodiranoIme = decodeURIComponent(ime);
        // Pronađi sve filmove gde glumac nastupa
        const filmovi = await film_1.default.find({
            glumci: { $in: [dekodiranoIme] }
        }).sort({ godina: -1 });
        res.json({ success: true, data: filmovi });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Greška pri preuzimanju filmova glumca', error: error.message });
    }
};
exports.getFilmoviZaGlumca = getFilmoviZaGlumca;
// GET /api/glumci/:ime/statistike - Preuzmi statistike za glumca
const getStatistikeGlumca = async (req, res) => {
    try {
        const { ime } = req.params;
        if (!ime) {
            return res.status(400).json({ success: false, message: 'Ime glumca je obavezno' });
        }
        const dekodiranoIme = decodeURIComponent(ime);
        // Pronađi sve filmove glumca
        const filmovi = await film_1.default.find({
            glumci: { $in: [dekodiranoIme] }
        });
        if (filmovi.length === 0) {
            return res.json({
                success: true,
                data: {
                    ukupnoFilmova: 0,
                    prosecnaOcena: 0,
                    najcesciZanr: 'N/A',
                    najuspesnijiFilm: 'N/A',
                    rasponGodina: 'N/A',
                    najcesciReziser: 'N/A'
                }
            });
        }
        // Ukupan broj filmova
        const ukupnoFilmova = filmovi.length;
        // Raspon godina (svi filmovi)
        const godine = filmovi.map(f => f.godina).sort((a, b) => a - b);
        const rasponGodina = godine.length > 0
            ? `${godine[0]} - ${godine[godine.length - 1]}`
            : 'N/A';
        // Nabavi najčešći žanr MEĐU SVIH filmova (ne samo ocenjenih)
        const zanrovi = {};
        filmovi.forEach(film => {
            if (film.zanr && film.zanr.length > 0) {
                film.zanr.forEach((zanr) => {
                    zanrovi[zanr] = (zanrovi[zanr] || 0) + 1;
                });
            }
        });
        const sortedZanrovi = Object.entries(zanrovi).sort((a, b) => b[1] - a[1]);
        const najcesciZanr = sortedZanrovi.length > 0 && sortedZanrovi[0] ? sortedZanrovi[0][0] : 'N/A';
        // Najčešći režiser (svi filmovi)
        const reziseri = {};
        filmovi.forEach(film => {
            if (film.reziser && film.reziser.length > 0) {
                film.reziser.forEach((rez) => {
                    reziseri[rez] = (reziseri[rez] || 0) + 1;
                });
            }
        });
        const sortedReziseri = Object.entries(reziseri).sort((a, b) => b[1] - a[1]);
        const najcesciReziser = sortedReziseri.length > 0 && sortedReziseri[0] ? sortedReziseri[0][0] : 'N/A';
        // Filtriraj samo filmove koji imaju ocene
        const filmoviSaOcenama = filmovi.filter(film => film.ocene && film.ocene.length > 0);
        // Ako nema ocenjenih filmova, vratiti statistike sa izračunatim žanrom/režiserom
        if (filmoviSaOcenama.length === 0) {
            return res.json({
                success: true,
                data: {
                    ukupnoFilmova: filmovi.length,
                    prosecnaOcena: 0,
                    najcesciZanr,
                    najuspesnijiFilm: 'N/A',
                    rasponGodina,
                    najcesciReziser
                }
            });
        }
        // Prosečna ocena SAMO za filmove koji imaju ocene
        let totalOcena = 0;
        filmoviSaOcenama.forEach(film => {
            const suma = film.ocene.reduce((acc, ocena) => {
                return acc + (ocena.ocena || ocena.vrednost || 0);
            }, 0);
            totalOcena += suma / film.ocene.length;
        });
        const prosecnaOcena = totalOcena / filmoviSaOcenama.length;
        // Najuspešniji film (najbolje ocenjen) SAMO među ocenjenim filmovima
        let najuspesnijiFilm = 'N/A';
        let maxOcena = 0;
        filmoviSaOcenama.forEach(film => {
            const suma = film.ocene.reduce((acc, ocena) => {
                return acc + (ocena.ocena || ocena.vrednost || 0);
            }, 0);
            const prosek = suma / film.ocene.length;
            if (prosek > maxOcena) {
                maxOcena = prosek;
                najuspesnijiFilm = film.naslov;
            }
        });
        res.json({
            success: true,
            data: {
                ukupnoFilmova,
                prosecnaOcena: Math.round(prosecnaOcena * 10) / 10,
                najcesciZanr,
                najuspesnijiFilm,
                rasponGodina,
                najcesciReziser
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Greška pri izračunavanju statistika', error: error.message });
    }
};
exports.getStatistikeGlumca = getStatistikeGlumca;
// POST /api/glumci - Kreiraj novog glumca
const createGlumac = async (req, res) => {
    try {
        const noviGlumac = new glumac_1.default(req.body);
        const sacuvaniGlumac = await noviGlumac.save();
        res.status(201).json({ success: true, data: sacuvaniGlumac });
    }
    catch (error) {
        res.status(400).json({ success: false, message: 'Greška pri kreiranju glumca', error: error.message });
    }
};
exports.createGlumac = createGlumac;
// PUT /api/glumci/:id - Ažuriraj glumca
const updateGlumac = async (req, res) => {
    try {
        const { id } = req.params;
        const azuriraniGlumac = await glumac_1.default.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!azuriraniGlumac) {
            return res.status(404).json({ success: false, message: 'Glumac nije pronađen' });
        }
        res.json({ success: true, data: azuriraniGlumac });
    }
    catch (error) {
        res.status(400).json({ success: false, message: 'Greška pri ažuriranju glumca', error: error.message });
    }
};
exports.updateGlumac = updateGlumac;
// DELETE /api/glumci/:id - Obriši glumca
const deleteGlumac = async (req, res) => {
    try {
        const { id } = req.params;
        const obrisaniGlumac = await glumac_1.default.findByIdAndDelete(id);
        if (!obrisaniGlumac) {
            return res.status(404).json({ success: false, message: 'Glumac nije pronađen' });
        }
        res.json({ success: true, message: 'Glumac uspešno obrisan', data: obrisaniGlumac });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Greška pri brisanju glumca', error: error.message });
    }
};
exports.deleteGlumac = deleteGlumac;
// GET /api/glumci/search?q=query - Pretraži glumce
const searchGlumci = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ success: false, message: 'Query parametar je obavezan' });
        }
        const glumci = await glumac_1.default.find({
            ime: { $regex: q, $options: 'i' }
        }).sort({ ime: 1 });
        res.json({ success: true, data: glumci });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Greška pri pretrazi glumaca', error: error.message });
    }
};
exports.searchGlumci = searchGlumci;
//# sourceMappingURL=glumacController.js.map