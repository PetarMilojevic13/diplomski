"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromFavorites = exports.addToFavorites = exports.getUserFavorites = exports.activateUser = exports.deactivateUser = exports.getUserByUsername = exports.getUserStatistics = exports.getAllUsers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const User = mongoose_1.default.model('User');
// GET /api/users - Get all users (admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-lozinka') // Ne vraćaj lozinku
            .sort({ _id: -1 });
        res.json({
            success: true,
            data: users
        });
    }
    catch (error) {
        console.error('Greška pri dohvatanju korisnika:', error);
        res.status(500).json({
            success: false,
            message: 'Greška pri dohvatanju korisnika',
            error: error.message
        });
    }
};
exports.getAllUsers = getAllUsers;
// GET /api/users/statistics - Get user statistics
const getUserStatistics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ type: 'korisnik' });
        const activeUsers = await User.countDocuments({ type: 'korisnik', status: 1, deactivated: 0 });
        const deactivatedUsers = await User.countDocuments({ type: 'korisnik', deactivated: 1 });
        res.json({
            success: true,
            data: {
                totalUsers,
                activeUsers,
                deactivatedUsers
            }
        });
    }
    catch (error) {
        console.error('Greška pri dohvatanju statistike korisnika:', error);
        res.status(500).json({
            success: false,
            message: 'Greška pri dohvatanju statistike',
            error: error.message
        });
    }
};
exports.getUserStatistics = getUserStatistics;
// GET /api/users/:kor_ime - Get user by username
const getUserByUsername = async (req, res) => {
    try {
        const { kor_ime } = req.params;
        const user = await User.findOne({ kor_ime }).select('-lozinka');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Korisnik nije pronađen'
            });
        }
        res.json({
            success: true,
            data: user
        });
    }
    catch (error) {
        console.error('Greška pri dohvatanju korisnika:', error);
        res.status(500).json({
            success: false,
            message: 'Greška pri dohvatanju korisnika',
            error: error.message
        });
    }
};
exports.getUserByUsername = getUserByUsername;
// PUT /api/users/:kor_ime/deactivate - Deactivate user
const deactivateUser = async (req, res) => {
    try {
        const { kor_ime } = req.params;
        const user = await User.findOne({ kor_ime });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Korisnik nije pronađen'
            });
        }
        user.deactivated = 1;
        user.status = 0;
        await user.save();
        res.json({
            success: true,
            data: user,
            message: 'Korisnik je deaktiviran'
        });
    }
    catch (error) {
        console.error('Greška pri deaktiviranju korisnika:', error);
        res.status(500).json({
            success: false,
            message: 'Greška pri deaktiviranju korisnika',
            error: error.message
        });
    }
};
exports.deactivateUser = deactivateUser;
// PUT /api/users/:kor_ime/activate - Activate user
const activateUser = async (req, res) => {
    try {
        const { kor_ime } = req.params;
        const user = await User.findOne({ kor_ime });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Korisnik nije pronađen'
            });
        }
        user.deactivated = 0;
        user.status = 1;
        await user.save();
        res.json({
            success: true,
            data: user,
            message: 'Korisnik je aktiviran'
        });
    }
    catch (error) {
        console.error('Greška pri aktiviranju korisnika:', error);
        res.status(500).json({
            success: false,
            message: 'Greška pri aktiviranju korisnika',
            error: error.message
        });
    }
};
exports.activateUser = activateUser;
// GET /api/users/:kor_ime/favorites - Get user's favorite films
const getUserFavorites = async (req, res) => {
    try {
        const { kor_ime } = req.params;
        const user = await User.findOne({ kor_ime }).populate('favorites');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Korisnik nije pronađen'
            });
        }
        res.json({
            success: true,
            data: user.favorites || []
        });
    }
    catch (error) {
        console.error('Greška pri dohvatanju favorita:', error);
        res.status(500).json({
            success: false,
            message: 'Greška pri dohvatanju favorita',
            error: error.message
        });
    }
};
exports.getUserFavorites = getUserFavorites;
// POST /api/users/:kor_ime/favorites/:filmId - Add film to favorites
const addToFavorites = async (req, res) => {
    try {
        const { kor_ime, filmId } = req.params;
        const user = await User.findOne({ kor_ime });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Korisnik nije pronađen'
            });
        }
        // Proveri da li film već postoji u favoritima
        if (user.favorites.includes(filmId)) {
            return res.status(400).json({
                success: false,
                message: 'Film je već u favoritima'
            });
        }
        user.favorites.push(filmId);
        await user.save();
        res.json({
            success: true,
            message: 'Film je dodat u favorite',
            data: user.favorites
        });
    }
    catch (error) {
        console.error('Greška pri dodavanju u favorite:', error);
        res.status(500).json({
            success: false,
            message: 'Greška pri dodavanju u favorite',
            error: error.message
        });
    }
};
exports.addToFavorites = addToFavorites;
// DELETE /api/users/:kor_ime/favorites/:filmId - Remove film from favorites
const removeFromFavorites = async (req, res) => {
    try {
        const { kor_ime, filmId } = req.params;
        const user = await User.findOne({ kor_ime });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Korisnik nije pronađen'
            });
        }
        user.favorites = user.favorites.filter((id) => id.toString() !== filmId);
        await user.save();
        res.json({
            success: true,
            message: 'Film je uklonjen iz favorita',
            data: user.favorites
        });
    }
    catch (error) {
        console.error('Greška pri uklanjanju iz favorita:', error);
        res.status(500).json({
            success: false,
            message: 'Greška pri uklanjanju iz favorita',
            error: error.message
        });
    }
};
exports.removeFromFavorites = removeFromFavorites;
//# sourceMappingURL=userController.js.map