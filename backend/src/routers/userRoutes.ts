import express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

// GET /api/users - Get all users (admin)
router.get('/', userController.getAllUsers);

// GET /api/users/statistics - Get user statistics
router.get('/statistics', userController.getUserStatistics);

// GET /api/users/:kor_ime - Get user by username
router.get('/:kor_ime', userController.getUserByUsername);

// PUT /api/users/:kor_ime/deactivate - Deactivate user
router.put('/:kor_ime/deactivate', userController.deactivateUser);

// PUT /api/users/:kor_ime/activate - Activate user
router.put('/:kor_ime/activate', userController.activateUser);

// GET /api/users/:kor_ime/favorites - Get user's favorite films
router.get('/:kor_ime/favorites', userController.getUserFavorites);

// POST /api/users/:kor_ime/favorites/:filmId - Add film to favorites
router.post('/:kor_ime/favorites/:filmId', userController.addToFavorites);

// DELETE /api/users/:kor_ime/favorites/:filmId - Remove film from favorites
router.delete('/:kor_ime/favorites/:filmId', userController.removeFromFavorites);

export default router;
