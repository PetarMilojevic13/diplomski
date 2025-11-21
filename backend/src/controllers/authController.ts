import { Request, Response } from 'express';
import { User } from '../models';
import bcrypt from 'bcrypt';

/**
 * Auth Controller - Upravljanje autentikacijom korisnika i admina
 */

// Login korisnika (obični korisnik)
export const loginKorisnik = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    console.log('🔄 Login attempt for user:', username);

    // Validacija input podataka
    if (!username || !password) {
      console.log('❌ Missing credentials');
      res.status(400).json(null);
      return;
    }

    // Pronalaženje korisnika u bazi - samo type=korisnik
    const user = await User.findOne({ 
      kor_ime: username,
      type: 'korisnik'
    });

    // Provera da li korisnik postoji
    if (!user) {
      console.log('❌ User not found:', username);
      res.status(401).json(null);
      return;
    }

    console.log('✅ User found:', username, 'status:', user.status);

    // Provera statusa korisnika (mora biti 1 = active)
    if (user.status !== 1) {
      console.log('❌ User status not active:', user.status);
      if (user.status === 0) {
        res.status(403).json({ message: 'Vaš nalog čeka odobrenje administratora.' });
      } else {
        res.status(403).json({ message: 'Vaš nalog je blokiran.' });
      }
      return;
    }

    // Provera lozinke - prvo pokušaj bcrypt, pa plain text (za stare korisnike)
    let isPasswordValid = false;
    
    // Prvo pokušaj bcrypt
    if (user.lozinka.startsWith('$2a$') || user.lozinka.startsWith('$2b$')) {
      // Lozinka je hash-ovana sa bcrypt
      console.log('🔐 Checking bcrypt password...');
      isPasswordValid = await bcrypt.compare(password, user.lozinka);
    } else {
      // Lozinka je plain text (stari korisnici)
      console.log('🔐 Checking plain text password...');
      isPasswordValid = (user.lozinka === password);
    }
    
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      res.status(401).json(null);
      return;
    }

    console.log('✅ Login successful for:', username);

    // Uspešan login - vraćamo celog korisnika
    res.status(200).json(user);
    return;
  } catch (error: any) {
    console.error('❌ Greška pri login-u korisnika:', error);
    res.status(500).json(null);
  }
};

// Login admina
export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Validacija input podataka
    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: 'Korisničko ime i lozinka su obavezni!'
      });
      return;
    }

    // Pronalaženje admina u bazi
    const admin = await User.findOne({ 
      kor_ime: username,
      type: 'admin' // Samo admini
    });

    // Provera da li admin postoji
    if (!admin) {
      res.status(401).json({
        success: false,
        message: 'Pogrešno korisničko ime ili lozinka!'
      });
      return;
    }

    // Provera lozinke - prvo pokušaj bcrypt, pa plain text (za stare admins)
    let isPasswordValid = false;
    try {
      isPasswordValid = await bcrypt.compare(password, admin.lozinka);
    } catch (error) {
      // Ako bcrypt ne uspe, probaj plain text proveru (za stare admins)
      isPasswordValid = (admin.lozinka === password);
    }
    
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Pogrešno korisničko ime ili lozinka!'
      });
      return;
    }

    // Provera da li je admin aktivan
    if (admin.deactivated === 1) {
      res.status(403).json({
        success: false,
        message: 'Vaš admin nalog je deaktiviran!'
      });
      return;
    }

    // Uspešan login - ne vraćamo lozinku
    const adminResponse = {
      kor_ime: admin.kor_ime,
      ime: admin.ime,
      prezime: admin.prezime,
      pol: admin.pol,
      adresa: admin.adresa,
      telefon: admin.telefon,
      email: admin.email,
      profileImage: admin.profileImage,
      type: admin.type,
      status: admin.status,
      deactivated: admin.deactivated
    };

    res.status(200).json({
      success: true,
      message: 'Uspešno ste se prijavili kao administrator!',
      user: adminResponse
    });

  } catch (error: any) {
    console.error('❌ Greška pri login-u admina:', error);
    res.status(500).json({
      success: false,
      message: 'Došlo je do greške na serveru!',
      error: error.message
    });
  }
};

// Logout (za sada samo dummy endpoint)
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Uspešno ste se odjavili!'
  });
};
