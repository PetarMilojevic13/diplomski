"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reziser_1 = __importDefault(require("../models/reziser"));
const router = express_1.default.Router();
// GET /api/reziseri - Get all reziseri
router.get('/', async (req, res) => {
    try {
        const reziseri = await reziser_1.default.find().sort({ ime: 1 });
        res.json(reziseri);
    }
    catch (error) {
        console.error('Error fetching reziseri:', error);
        res.status(500).json({ message: 'Error fetching reziseri' });
    }
});
// GET /api/reziseri/:ime - Get reziser by ime
router.get('/:ime', async (req, res) => {
    try {
        const ime = decodeURIComponent(req.params.ime);
        const reziser = await reziser_1.default.findOne({ ime: { $regex: new RegExp(`^${ime}$`, 'i') } });
        if (!reziser) {
            return res.status(404).json({ message: 'Reziser not found' });
        }
        res.json(reziser);
    }
    catch (error) {
        console.error('Error fetching reziser:', error);
        res.status(500).json({ message: 'Error fetching reziser' });
    }
});
exports.default = router;
//# sourceMappingURL=reziser.js.map