import express from 'express';
import Reziser from '../models/reziser';

const router = express.Router();

// GET /api/reziseri - Get all reziseri
router.get('/', async (req, res) => {
  try {
    const reziseri = await Reziser.find().sort({ ime: 1 });
    res.json(reziseri);
  } catch (error) {
    console.error('Error fetching reziseri:', error);
    res.status(500).json({ message: 'Error fetching reziseri' });
  }
});

// GET /api/reziseri/:ime - Get reziser by ime
router.get('/:ime', async (req, res) => {
  try {
    const ime = decodeURIComponent(req.params.ime);
    const reziser = await Reziser.findOne({ ime: { $regex: new RegExp(`^${ime}$`, 'i') } });
    
    if (!reziser) {
      return res.status(404).json({ message: 'Reziser not found' });
    }
    
    res.json(reziser);
  } catch (error) {
    console.error('Error fetching reziser:', error);
    res.status(500).json({ message: 'Error fetching reziser' });
  }
});

export default router;
