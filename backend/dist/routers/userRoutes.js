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
const userController = __importStar(require("../controllers/userController"));
const router = express_1.default.Router();
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
exports.default = router;
//# sourceMappingURL=userRoutes.js.map