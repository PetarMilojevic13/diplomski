"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectRegistrationRequest = exports.approveRegistrationRequest = exports.getPendingRegistrationRequests = exports.getAllRegistrationRequests = exports.checkEmailAvailability = exports.checkUsernameAvailability = exports.registerKorisnik = void 0;
const models_1 = require("../models");
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * Registration Controller - Upravljanje registracijom novih korisnika
 * Korisnici se kreiraju direktno u Users kolekciji sa status=0 (pending)
 */
// Registracija novog korisnika (kreira korisnika sa status=0)
const registerKorisnik = async (req, res) => {
    try {
        const { kor_ime, lozinka, ime, prezime, pol, adresa, telefon, email, profileImage } = req.body;
        console.log('🔄 registerKorisnik called:', { kor_ime, email });
        // Validacija obaveznih polja
        if (!kor_ime || !lozinka || !ime || !prezime || !pol || !adresa || !telefon || !email) {
            res.status(400).json({
                success: false,
                message: 'Sva polja su obavezna osim profilne slike!'
            });
            return;
        }
        // Validacija pola (mora biti 'M' ili 'Ž')
        if (pol !== 'M' && pol !== 'Ž') {
            res.status(400).json({
                success: false,
                message: 'Pol mora biti M ili Ž!'
            });
            return;
        }
        // Provera da li korisničko ime već postoji
        const existingUserByUsername = await models_1.User.findOne({ kor_ime });
        if (existingUserByUsername) {
            res.status(409).json({
                success: false,
                message: 'Korisničko ime već postoji!'
            });
            return;
        }
        // Provera da li email već postoji
        const existingUserByEmail = await models_1.User.findOne({ email });
        if (existingUserByEmail) {
            res.status(409).json({
                success: false,
                message: 'Email adresa već postoji!'
            });
            return;
        }
        // Hash lozinke
        const hashedPassword = await bcrypt_1.default.hash(lozinka, 10);
        // Kreiranje novog korisnika sa status=0 (pending approval)
        const newUser = new models_1.User({
            kor_ime,
            lozinka: hashedPassword,
            ime,
            prezime,
            pol,
            adresa,
            telefon,
            email,
            profileImage: profileImage || '',
            type: 'korisnik',
            status: 0, // 0 = pending (čeka odobrenje)
            deactivated: 0,
            wishlist: [],
            favorites: []
        });
        await newUser.save();
        console.log('✅ New user registered (pending):', newUser._id);
        res.status(201).json({
            success: true,
            message: 'Zahtev za registraciju uspešno poslat! Molimo sačekajte odobrenje administratora.',
            userId: newUser._id
        });
    }
    catch (error) {
        console.error('❌ Greška pri registraciji:', error);
        res.status(500).json({
            success: false,
            message: 'Došlo je do greške na serveru!',
            error: error.message
        });
    }
};
exports.registerKorisnik = registerKorisnik;
// Provera da li korisničko ime već postoji
const checkUsernameAvailability = async (req, res) => {
    try {
        const { username } = req.params;
        if (!username) {
            res.status(400).json({
                success: false,
                message: 'Korisničko ime je obavezno!'
            });
            return;
        }
        // Provera u User tabeli (bilo koji status)
        const existingUser = await models_1.User.findOne({ kor_ime: username });
        const isAvailable = !existingUser;
        res.status(200).json({
            success: true,
            available: isAvailable,
            message: isAvailable
                ? 'Korisničko ime je dostupno'
                : 'Korisničko ime već postoji'
        });
    }
    catch (error) {
        console.error('❌ Greška pri proveri korisničkog imena:', error);
        res.status(500).json({
            success: false,
            message: 'Došlo je do greške na serveru!',
            error: error.message
        });
    }
};
exports.checkUsernameAvailability = checkUsernameAvailability;
// Provera da li email već postoji
const checkEmailAvailability = async (req, res) => {
    try {
        const { email } = req.params;
        if (!email) {
            res.status(400).json({
                success: false,
                message: 'Email je obavezan!'
            });
            return;
        }
        // Provera u User tabeli (bilo koji status)
        const existingUser = await models_1.User.findOne({ email });
        const isAvailable = !existingUser;
        res.status(200).json({
            success: true,
            available: isAvailable,
            message: isAvailable
                ? 'Email je dostupan'
                : 'Email adresa već postoji'
        });
    }
    catch (error) {
        console.error('❌ Greška pri proveri email-a:', error);
        res.status(500).json({
            success: false,
            message: 'Došlo je do greške na serveru!',
            error: error.message
        });
    }
};
exports.checkEmailAvailability = checkEmailAvailability;
// ADMIN: Get all pending users (status=0)
const getAllRegistrationRequests = async (req, res) => {
    try {
        const pendingUsers = await models_1.User.find({ status: 0, type: 'korisnik' })
            .sort({ createdAt: -1 }); // Najnoviji prvo
        res.status(200).json({
            success: true,
            data: pendingUsers
        });
    }
    catch (error) {
        console.error('❌ Greška pri dohvatanju pending korisnika:', error);
        res.status(500).json({
            success: false,
            message: 'Došlo je do greške na serveru!',
            error: error.message
        });
    }
};
exports.getAllRegistrationRequests = getAllRegistrationRequests;
// ADMIN: Get pending registration requests (status = 0)
const getPendingRegistrationRequests = async (req, res) => {
    try {
        const pendingUsers = await models_1.User.find({ status: 0, type: 'korisnik' })
            .sort({ createdAt: -1 }); // Najnoviji prvo
        res.status(200).json({
            success: true,
            data: pendingUsers,
            count: pendingUsers.length
        });
    }
    catch (error) {
        console.error('❌ Greška pri dohvatanju pending korisnika:', error);
        res.status(500).json({
            success: false,
            message: 'Došlo je do greške na serveru!',
            error: error.message
        });
    }
};
exports.getPendingRegistrationRequests = getPendingRegistrationRequests;
// ADMIN: Approve user (change status from 0 to 1)
const approveRegistrationRequest = async (req, res) => {
    try {
        console.log('🔄 approveRegistrationRequest called');
        const { requestId } = req.params; // requestId je zapravo userId
        const { adminUsername } = req.body;
        console.log('📝 User ID:', requestId);
        console.log('👤 Admin Username:', adminUsername);
        if (!requestId || !adminUsername) {
            console.log('❌ Missing parameters');
            res.status(400).json({
                success: false,
                message: 'User ID i admin username su obavezni!'
            });
            return;
        }
        // Pronađi korisnika
        const user = await models_1.User.findById(requestId);
        console.log('📄 Found user:', user);
        if (!user) {
            console.log('❌ User not found');
            res.status(404).json({
                success: false,
                message: 'Korisnik nije pronađen!'
            });
            return;
        }
        // Proveri da li je korisnik već odobren
        if (user.status !== 0) {
            console.log('❌ User already approved');
            res.status(400).json({
                success: false,
                message: 'Korisnik je već odobren ili blokiran!'
            });
            return;
        }
        // Ažuriraj status korisnika na 1 (active/approved)
        user.status = 1;
        await user.save();
        console.log('✅ User approved successfully:', user._id);
        res.status(200).json({
            success: true,
            message: `Korisnik "${user.kor_ime}" je uspešno odobren!`,
            data: user
        });
    }
    catch (error) {
        console.error('❌ Greška pri odobravanju korisnika:', error);
        res.status(500).json({
            success: false,
            message: 'Došlo je do greške na serveru!',
            error: error.message
        });
    }
};
exports.approveRegistrationRequest = approveRegistrationRequest;
// ADMIN: Reject user - deletes the user or changes status to 2
const rejectRegistrationRequest = async (req, res) => {
    try {
        const { requestId } = req.params; // requestId je zapravo userId
        const { adminUsername, reason } = req.body;
        if (!requestId || !adminUsername) {
            res.status(400).json({
                success: false,
                message: 'User ID i admin username su obavezni!'
            });
            return;
        }
        // Pronađi korisnika
        const user = await models_1.User.findById(requestId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Korisnik nije pronađen!'
            });
            return;
        }
        // Proveri da li je korisnik pending
        if (user.status !== 0) {
            res.status(400).json({
                success: false,
                message: 'Korisnik nije u pending statusu!'
            });
            return;
        }
        // Obrišemo korisnika nakon odbijanja (ili možemo da postavimo status=2)
        await models_1.User.findByIdAndDelete(requestId);
        res.status(200).json({
            success: true,
            message: `Zahtev korisnika "${user.kor_ime}" je odbijen i obrisan.`
        });
    }
    catch (error) {
        console.error('❌ Greška pri odbijanju korisnika:', error);
        res.status(500).json({
            success: false,
            message: 'Došlo je do greške na serveru!',
            error: error.message
        });
    }
};
exports.rejectRegistrationRequest = rejectRegistrationRequest;
//# sourceMappingURL=registrationController.js.map