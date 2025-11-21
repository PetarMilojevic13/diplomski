"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthlyRentalTrends = exports.getRentalStatisticsAdmin = exports.checkRentalConflict = exports.deleteIznajmljivanje = exports.getStatistikaIznajmljivanja = exports.vratiIznajmljivanje = exports.createIznajmljivanje = exports.getAktivnaIznajmljivanja = exports.getIznajmljivanjaByKorisnik = exports.getAllIznajmljivanja = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Iznajmljivanje = mongoose_1.default.model('Iznajmljivanje');
const Film = mongoose_1.default.model('Film');
const User = mongoose_1.default.model('User');
// GET /api/iznajmljivanja - Get all rentals (admin)
const getAllIznajmljivanja = async (req, res) => {
    try {
        const iznajmljivanja = await Iznajmljivanje.find()
            .populate('film')
            .sort({ datumIznajmljivanja: -1 });
        res.json({
            success: true,
            data: iznajmljivanja
        });
    }
    catch (error) {
        console.error('Greška pri dohvatanju svih iznajmljivanja:', error);
        res.status(500).json({
            success: false,
            message: 'Greška pri dohvatanju iznajmljivanja',
            error: error.message
        });
    }
};
exports.getAllIznajmljivanja = getAllIznajmljivanja;
// GET /api/iznajmljivanja/korisnik/:kor_ime - Get all rentals for a user
const getIznajmljivanjaByKorisnik = async (req, res) => {
    try {
        const { kor_ime } = req.params;
        // Pronađi korisnika po kor_ime
        const user = await User.findOne({ kor_ime });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Korisnik nije pronađen'
            });
        }
        // Pronađi sva iznajmljivanja za korisnika
        const iznajmljivanja = await Iznajmljivanje.find({ korisnik: kor_ime })
            .populate('film')
            .sort({ datumIznajmljivanja: -1 });
        res.json({
            success: true,
            data: iznajmljivanja
        });
    }
    catch (error) {
        console.error('Greška pri dohvatanju iznajmljivanja korisnika:', error);
        res.status(500).json({
            success: false,
            message: 'Greška pri dohvatanju iznajmljivanja',
            error: error.message
        });
    }
};
exports.getIznajmljivanjaByKorisnik = getIznajmljivanjaByKorisnik;
// GET /api/iznajmljivanja/aktivna/:kor_ime - Get only active rentals for a user
const getAktivnaIznajmljivanja = async (req, res) => {
    try {
        const { kor_ime } = req.params;
        const svaIznajmljivanja = await Iznajmljivanje.find({ korisnik: kor_ime });
        const danas = new Date();
        danas.setHours(0, 0, 0, 0);
        const aktivnaIznajmljivanja = svaIznajmljivanja.filter(i => {
            const pocetak = new Date(i.datumIznajmljivanja);
            pocetak.setHours(0, 0, 0, 0);
            const kraj = new Date(i.datumVracanja);
            kraj.setHours(0, 0, 0, 0);
            return danas >= pocetak && danas < kraj;
        }).sort((a, b) => new Date(a.datumVracanja).getTime() - new Date(b.datumVracanja).getTime());
        res.json({
            success: true,
            data: aktivnaIznajmljivanja
        });
    }
    catch (error) {
        console.error('Greška pri dohvatanju aktivnih iznajmljivanja:', error);
        res.status(500).json({
            success: false,
            message: 'Greška pri dohvatanju aktivnih iznajmljivanja',
            error: error.message
        });
    }
};
exports.getAktivnaIznajmljivanja = getAktivnaIznajmljivanja;
// POST /api/iznajmljivanja - Create new rental
const createIznajmljivanje = async (req, res) => {
    try {
        const { kor_ime, filmId, brojDana, cardType } = req.body;
        // Validacija
        if (!kor_ime || !filmId || !brojDana || !cardType) {
            return res.status(400).json({
                success: false,
                message: 'Nedostaju obavezna polja'
            });
        }
        // Pronađi film
        const film = await Film.findById(filmId);
        if (!film) {
            return res.status(404).json({
                success: false,
                message: 'Film nije pronađen'
            });
        }
        // Proveri dostupnost
        if (!film.dostupnost) {
            return res.status(400).json({
                success: false,
                message: 'Film trenutno nije dostupan za iznajmljivanje'
            });
        }
        // Kreiraj iznajmljivanje
        const datumIznajmljivanja = new Date();
        const planiraniDatumVracanja = new Date();
        planiraniDatumVracanja.setDate(planiraniDatumVracanja.getDate() + brojDana);
        // Dan vraćanja se ne naplaćuje, korisnik plaća samo za dane gledanja
        const naplataDana = Math.max(1, brojDana - 1); // minimalno 1 dan
        const ukupnaCena = film.cenaDnevno * naplataDana;
        const novoIznajmljivanje = new Iznajmljivanje({
            korisnik: kor_ime,
            film: film._id,
            datumIznajmljivanja,
            datumVracanja: planiraniDatumVracanja,
            cenaDnevno: film.cenaDnevno,
            brojDana,
            ukupnaCena,
            cardType
        });
        await novoIznajmljivanje.save();
        // Ažuriraj dostupnost filma
        film.dostupnost = false;
        await film.save();
        // Populate pre slanja
        const populatedIznajmljivanje = await Iznajmljivanje.findById(novoIznajmljivanje._id)
            .populate('film');
        res.status(201).json({
            success: true,
            message: 'Iznajmljivanje uspešno kreirano',
            data: populatedIznajmljivanje
        });
    }
    catch (error) {
        console.error('Greška pri kreiranju iznajmljivanja:', error);
        res.status(500).json({
            success: false,
            message: 'Greška pri kreiranju iznajmljivanja',
            error: error.message
        });
    }
};
exports.createIznajmljivanje = createIznajmljivanje;
// PUT /api/iznajmljivanja/:id/vrati - Return rental
const vratiIznajmljivanje = async (req, res) => {
    try {
        const { id } = req.params;
        const iznajmljivanje = await Iznajmljivanje.findById(id).populate('film');
        if (!iznajmljivanje) {
            return res.status(404).json({
                success: false,
                message: 'Iznajmljivanje nije pronađeno'
            });
        }
        const danas = new Date();
        danas.setHours(0, 0, 0, 0);
        const pocetak = new Date(iznajmljivanje.datumIznajmljivanja);
        pocetak.setHours(0, 0, 0, 0);
        const kraj = new Date(iznajmljivanje.datumVracanja);
        kraj.setHours(0, 0, 0, 0);
        const isAktivno = danas >= pocetak && danas < kraj;
        if (!isAktivno) {
            return res.status(400).json({
                success: false,
                message: 'Iznajmljivanje nije aktivno'
            });
        }
        // Postavi datum vraćanja na danas (ručno vraćanje)
        iznajmljivanje.datumVracanja = new Date();
        await iznajmljivanje.save();
        // Vrati dostupnost filma
        const film = await Film.findById(iznajmljivanje.film);
        if (film) {
            film.dostupnost = true;
            await film.save();
        }
        const updatedIznajmljivanje = await Iznajmljivanje.findById(id)
            .populate('film')
            .populate('korisnik', 'kor_ime ime prezime email');
        res.json({
            success: true,
            message: 'Film uspešno vraćen',
            data: updatedIznajmljivanje
        });
    }
    catch (error) {
        console.error('Greška pri vraćanju iznajmljivanja:', error);
        res.status(500).json({
            success: false,
            message: 'Greška pri vraćanju iznajmljivanja',
            error: error.message
        });
    }
};
exports.vratiIznajmljivanje = vratiIznajmljivanje;
// GET /api/iznajmljivanja/statistika/:kor_ime - Get rental statistics for user
const getStatistikaIznajmljivanja = async (req, res) => {
    try {
        const { kor_ime } = req.params;
        const user = await User.findOne({ kor_ime });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Korisnik nije pronađen'
            });
        }
        const svaIznajmljivanja = await Iznajmljivanje.find({ korisnik: user._id }).populate('film');
        const danas = new Date();
        danas.setHours(0, 0, 0, 0);
        const aktivnaIznajmljivanja = svaIznajmljivanja.filter(i => {
            const pocetak = new Date(i.datumIznajmljivanja);
            pocetak.setHours(0, 0, 0, 0);
            const kraj = new Date(i.datumVracanja);
            kraj.setHours(0, 0, 0, 0);
            return danas >= pocetak && danas < kraj;
        });
        const vracenaIznajmljivanja = svaIznajmljivanja.filter(i => {
            const kraj = new Date(i.datumVracanja);
            kraj.setHours(0, 0, 0, 0);
            return danas >= kraj;
        });
        const statistika = {
            ukupnoIznajmljivanja: svaIznajmljivanja.length,
            aktivnaIznajmljivanja: aktivnaIznajmljivanja.length,
            vracenaIznajmljivanja: vracenaIznajmljivanja.length,
            ukupnoPotroseno: svaIznajmljivanja.reduce((sum, i) => sum + i.ukupnaCena, 0)
        };
        res.json({
            success: true,
            data: statistika
        });
    }
    catch (error) {
        console.error('Greška pri dohvatanju statistike:', error);
        res.status(500).json({
            success: false,
            message: 'Greška pri dohvatanju statistike',
            error: error.message
        });
    }
};
exports.getStatistikaIznajmljivanja = getStatistikaIznajmljivanja;
// DELETE /api/iznajmljivanja/:id - Delete rental (admin only)
const deleteIznajmljivanje = async (req, res) => {
    try {
        const { id } = req.params;
        const iznajmljivanje = await Iznajmljivanje.findById(id);
        if (!iznajmljivanje) {
            return res.status(404).json({
                success: false,
                message: 'Iznajmljivanje nije pronađeno'
            });
        }
        // Proveri da li je aktivno (ako jeste, vrati dostupnost filma)
        const danas = new Date();
        danas.setHours(0, 0, 0, 0);
        const pocetak = new Date(iznajmljivanje.datumIznajmljivanja);
        pocetak.setHours(0, 0, 0, 0);
        const kraj = new Date(iznajmljivanje.datumVracanja);
        kraj.setHours(0, 0, 0, 0);
        const isAktivno = danas >= pocetak && danas < kraj;
        if (isAktivno) {
            const film = await Film.findById(iznajmljivanje.film);
            if (film) {
                film.dostupnost = true;
                await film.save();
            }
        }
        await Iznajmljivanje.findByIdAndDelete(id);
        res.json({
            success: true,
            message: 'Iznajmljivanje uspešno obrisano'
        });
    }
    catch (error) {
        console.error('Greška pri brisanju iznajmljivanja:', error);
        res.status(500).json({
            success: false,
            message: 'Greška pri brisanju iznajmljivanja',
            error: error.message
        });
    }
};
exports.deleteIznajmljivanje = deleteIznajmljivanje;
// POST /api/iznajmljivanja/check-conflict - Check if rental conflicts with existing rentals
const checkRentalConflict = async (req, res) => {
    try {
        const { korisnikIme, filmId, startDate, endDate } = req.body;
        // Validacija parametara
        if (!korisnikIme || !filmId || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Svi parametri su obavezni (korisnikIme, filmId, startDate, endDate)'
            });
        }
        // Pronađi korisnika
        const user = await User.findOne({ kor_ime: korisnikIme });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Korisnik nije pronađen'
            });
        }
        // Konvertuj datume
        const noviStart = new Date(startDate);
        const noviEnd = new Date(endDate);
        // Proveri validnost datuma
        if (isNaN(noviStart.getTime()) || isNaN(noviEnd.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Nevalidni datumi'
            });
        }
        if (noviStart >= noviEnd) {
            return res.status(400).json({
                success: false,
                message: 'Datum početka mora biti pre datuma kraja'
            });
        }
        // Pronađi sva iznajmljivanja za datog korisnika i film (bez polja status)
        const svaIznajmljivanja = await Iznajmljivanje.find({
            korisnik: user._id,
            film: filmId
        });
        // Proveri da li se termini preklapaju (standardna interval overlap provera)
        let hasConflict = false;
        let conflictingRental = null;
        for (const iznajmljivanje of svaIznajmljivanja) {
            const postojeciStart = new Date(iznajmljivanje.datumIznajmljivanja);
            // Preferiraj planiraniDatumVracanja ako postoji, inače datumVracanja
            const postojeciEnd = iznajmljivanje.planiraniDatumVracanja
                ? new Date(iznajmljivanje.planiraniDatumVracanja)
                : (iznajmljivanje.datumVracanja ? new Date(iznajmljivanje.datumVracanja) : null);
            // Ako ne možemo parsirati start, preskoči
            if (isNaN(postojeciStart.getTime())) {
                continue;
            }
            // Ako nemamo validan kraj, tretiraj kao otvoren period do "daleke" budućnosti
            const postojeciEndEffective = (postojeciEnd && !isNaN(postojeciEnd.getTime()))
                ? postojeciEnd
                : new Date(8640000000000000); // very far future
            // Proveri oba smera containment-a i standardno preklapanje:
            // - novi interval sasvim sadrzi postojeći
            // - postojeći interval sasvim sadrzi novi
            // - delimično se preklapaju
            const newContainsExisting = (noviStart <= postojeciStart) && (noviEnd >= postojeciEndEffective);
            const existingContainsNew = (postojeciStart <= noviStart) && (postojeciEndEffective >= noviEnd);
            const overlap = (noviStart < postojeciEndEffective) && (noviEnd > postojeciStart);
            if (newContainsExisting || existingContainsNew || overlap) {
                hasConflict = true;
                conflictingRental = { id: iznajmljivanje._id, datumIznajmljivanja: iznajmljivanje.datumIznajmljivanja, planiraniDatumVracanja: iznajmljivanje.planiraniDatumVracanja || iznajmljivanje.datumVracanja };
                break;
            }
        }
        res.json({
            success: true,
            data: {
                hasConflict,
                conflictingRental,
                message: hasConflict
                    ? 'Već imate aktivno iznajmljivanje ovog filma u ovom periodu'
                    : 'Nema konflikta - možete iznajmiti film'
            }
        });
    }
    catch (error) {
        console.error('Greška pri proveri konflikta:', error);
        res.status(500).json({
            success: false,
            message: 'Greška pri proveri konflikta',
            error: error.message
        });
    }
};
exports.checkRentalConflict = checkRentalConflict;
// GET /api/iznajmljivanja/admin/statistics - Get rental statistics for admin
const getRentalStatisticsAdmin = async (req, res) => {
    try {
        const totalRentals = await Iznajmljivanje.countDocuments();
        // Dobavi potrebna polja za izračunavanja baziranih na datumima
        const sve = await Iznajmljivanje.find().select('datumIznajmljivanja datumVracanja planiraniDatumVracanja ukupnaCena');
        const danas = new Date();
        danas.setHours(0, 0, 0, 0);
        let activeRentals = 0;
        let returnedRentals = 0;
        for (const r of sve) {
            const start = r.datumIznajmljivanja ? new Date(r.datumIznajmljivanja) : null;
            const end = r.planiraniDatumVracanja ? new Date(r.planiraniDatumVracanja) : (r.datumVracanja ? new Date(r.datumVracanja) : null);
            if (start)
                start.setHours(0, 0, 0, 0);
            if (end)
                end.setHours(0, 0, 0, 0);
            if (start && end) {
                if (danas >= start && danas < end)
                    activeRentals++;
                else if (danas >= end)
                    returnedRentals++;
            }
            else if (start && !end) {
                // no end date — treat as active if started
                if (danas >= start)
                    activeRentals++;
            }
        }
        // We don't have a dedicated 'cancelled' field anymore; set to 0.
        const cancelledRentals = 0;
        res.json({
            success: true,
            data: {
                totalRentals,
                activeRentals,
                returnedRentals,
                cancelledRentals
            }
        });
    }
    catch (error) {
        console.error('Greška pri dohvatanju statistike:', error);
        res.status(500).json({
            success: false,
            message: 'Greška pri dohvatanju statistike',
            error: error.message
        });
    }
};
exports.getRentalStatisticsAdmin = getRentalStatisticsAdmin;
// GET /api/iznajmljivanja/admin/monthly-trends - Get monthly rental trends
const getMonthlyRentalTrends = async (req, res) => {
    try {
        // Dobavi sva iznajmljivanja
        const allRentals = await Iznajmljivanje.find().select('datumIznajmljivanja');
        // Kreiraj map za brojanje po mesecima
        const monthCounts = new Map();
        const monthNames = [
            'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun',
            'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'
        ];
        // Inicijalizuj poslednih 12 meseci sa 0
        const currentDate = new Date();
        for (let i = 11; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
            monthCounts.set(key, 0);
        }
        // Prebroj iznajmljivanja po mesecima
        allRentals.forEach(rental => {
            const rentalDate = new Date(rental.datumIznajmljivanja);
            const monthKey = `${monthNames[rentalDate.getMonth()]} ${rentalDate.getFullYear()}`;
            if (monthCounts.has(monthKey)) {
                monthCounts.set(monthKey, (monthCounts.get(monthKey) || 0) + 1);
            }
        });
        // Konvertuj u niz
        const monthlyData = Array.from(monthCounts.entries()).map(([month, count]) => ({
            month,
            count
        }));
        res.json({
            success: true,
            data: monthlyData
        });
    }
    catch (error) {
        console.error('Greška pri dohvatanju mesečnih trendova:', error);
        res.status(500).json({
            success: false,
            message: 'Greška pri dohvatanju mesečnih trendova',
            error: error.message
        });
    }
};
exports.getMonthlyRentalTrends = getMonthlyRentalTrends;
//# sourceMappingURL=iznajmljivanjeController.js.map