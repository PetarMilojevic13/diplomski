import { Request, Response } from 'express';
import mongoose from 'mongoose';

const User = mongoose.model('User');

// GET /api/users - Get all users (admin only)
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find()
            .select('-lozinka') // Ne vraćaj lozinku
            .sort({ _id: -1 });

        res.json({
            success: true,
            data: users
        });
    } catch (error: any) {
        console.error('Greška pri dohvatanju korisnika:', error);
        res.status(500).json({
            success: false,
            message: 'Greška pri dohvatanju korisnika',
            error: error.message
        });
    }
};

// GET /api/users/statistics - Get user statistics
export const getUserStatistics = async (req: Request, res: Response) => {
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
    } catch (error: any) {
        console.error('Greška pri dohvatanju statistike korisnika:', error);
        res.status(500).json({
            success: false,
            message: 'Greška pri dohvatanju statistike',
            error: error.message
        });
    }
};

// GET /api/users/:kor_ime - Get user by username
export const getUserByUsername = async (req: Request, res: Response) => {
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
    } catch (error: any) {
        console.error('Greška pri dohvatanju korisnika:', error);
        res.status(500).json({
            success: false,
            message: 'Greška pri dohvatanju korisnika',
            error: error.message
        });
    }
};

// PUT /api/users/:kor_ime/deactivate - Deactivate user
export const deactivateUser = async (req: Request, res: Response) => {
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
    } catch (error: any) {
        console.error('Greška pri deaktiviranju korisnika:', error);
        res.status(500).json({
            success: false,
            message: 'Greška pri deaktiviranju korisnika',
            error: error.message
        });
    }
};

// PUT /api/users/:kor_ime/activate - Activate user
export const activateUser = async (req: Request, res: Response) => {
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
    } catch (error: any) {
        console.error('Greška pri aktiviranju korisnika:', error);
        res.status(500).json({
            success: false,
            message: 'Greška pri aktiviranju korisnika',
            error: error.message
        });
    }
};

// GET /api/users/:kor_ime/favorites - Get user's favorite films
export const getUserFavorites = async (req: Request, res: Response) => {
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
    } catch (error: any) {
        console.error('Greška pri dohvatanju favorita:', error);
        res.status(500).json({
            success: false,
            message: 'Greška pri dohvatanju favorita',
            error: error.message
        });
    }
};

// POST /api/users/:kor_ime/favorites/:filmId - Add film to favorites
export const addToFavorites = async (req: Request, res: Response) => {
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
        if (user.favorites.includes(filmId as any)) {
            return res.status(400).json({
                success: false,
                message: 'Film je već u favoritima'
            });
        }

        user.favorites.push(filmId as any);
        await user.save();

        res.json({
            success: true,
            message: 'Film je dodat u favorite',
            data: user.favorites
        });
    } catch (error: any) {
        console.error('Greška pri dodavanju u favorite:', error);
        res.status(500).json({
            success: false,
            message: 'Greška pri dodavanju u favorite',
            error: error.message
        });
    }
};

// DELETE /api/users/:kor_ime/favorites/:filmId - Remove film from favorites
export const removeFromFavorites = async (req: Request, res: Response) => {
    try {
        const { kor_ime, filmId } = req.params;

        const user = await User.findOne({ kor_ime });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Korisnik nije pronađen'
            });
        }

        user.favorites = user.favorites.filter((id: any) => id.toString() !== filmId);
        await user.save();

        res.json({
            success: true,
            message: 'Film je uklonjen iz favorita',
            data: user.favorites
        });
    } catch (error: any) {
        console.error('Greška pri uklanjanju iz favorita:', error);
        res.status(500).json({
            success: false,
            message: 'Greška pri uklanjanju iz favorita',
            error: error.message
        });
    }
};
