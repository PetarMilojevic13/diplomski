import { Request, Response } from 'express';
import Film from '../models/film';
import Iznajmljivanje from '../models/iznajmljivanje';

// Preuzmi sve filmove
export const getAllFilms = async (req: Request, res: Response): Promise<void> => {
  try {
    const films = await Film.find().sort({ naslov: 1 }); // Sortirano po naslovu

    res.status(200).json({
      success: true,
      count: films.length,
      data: films
    });
  } catch (error: any) {
    console.error('❌ Greška pri preuzimanju filmova:', error);
    res.status(500).json({
      success: false,
      message: 'Došlo je do greške pri preuzimanju filmova!',
      error: error.message
    });
  }
};

// Preuzmi film po ID-u
export const getFilmById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const film = await Film.findById(id);

    if (!film) {
      res.status(404).json({
        success: false,
        message: 'Film nije pronađen!'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: film
    });
  } catch (error: any) {
    console.error('❌ Greška pri preuzimanju filma:', error);
    res.status(500).json({
      success: false,
      message: 'Došlo je do greške pri preuzimanju filma!',
      error: error.message
    });
  }
};

// POST /api/films - Kreiraj novi film (admin only)
export const createFilm = async (req: Request, res: Response): Promise<void> => {
  try {
    const filmData = req.body;

    // Validacija obaveznih polja
    if (!filmData.naslov || !filmData.zanr || filmData.zanr.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Naslov i žanr su obavezni!'
      });
      return;
    }


    // Kreiraj novi film
    const newFilm = new Film(filmData);
    await newFilm.save();

    console.log('✅ Novi film kreiran:', newFilm.naslov);

    res.status(201).json({
      success: true,
      message: 'Film uspešno kreiran!',
      data: newFilm
    });
  } catch (error: any) {
    console.error('❌ Greška pri kreiranju filma:', error);
    res.status(500).json({
      success: false,
      message: 'Došlo je do greške pri kreiranju filma!',
      error: error.message
    });
  }
};

// Pretraži filmove po naslovu
export const searchFilms = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Query parametar je obavezan!'
      });
      return;
    }

    const films = await Film.find({
      naslov: { $regex: q, $options: 'i' } // Case-insensitive pretraga
    }).sort({ naslov: 1 });

    res.status(200).json({
      success: true,
      count: films.length,
      data: films
    });
  } catch (error: any) {
    console.error('❌ Greška pri pretrazi filmova:', error);
    res.status(500).json({
      success: false,
      message: 'Došlo je do greške pri pretrazi filmova!',
      error: error.message
    });
  }
};

// Preuzmi filmove po žanru
export const getFilmsByGenre = async (req: Request, res: Response): Promise<void> => {
  try {
    const { zanr } = req.params;

    const films = await Film.find({
      zanr: { $in: [zanr] }
    }).sort({ naslov: 1 });

    res.status(200).json({
      success: true,
      count: films.length,
      data: films
    });
  } catch (error: any) {
    console.error('❌ Greška pri preuzimanju filmova po žanru:', error);
    res.status(500).json({
      success: false,
      message: 'Došlo je do greške pri preuzimanju filmova!',
      error: error.message
    });
  }
};

// Preuzmi slične filmove (KNN algoritam)
export const getSimilarFilms = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit as string) || 6;

    const film = await Film.findById(id);

    if (!film) {
      res.status(404).json({
        success: false,
        message: 'Film nije pronađen!'
      });
      return;
    }

    // Pronađi filmove sa istim žanrovima ili režiserima
    const similarFilms = await Film.find({
      _id: { $ne: id }, // Isključi trenutni film
      $or: [
        { zanr: { $in: film.zanr } },
        { reziser: { $in: film.reziser } }
      ]
    }).limit(limit);

    res.status(200).json({
      success: true,
      count: similarFilms.length,
      data: similarFilms
    });
  } catch (error: any) {
    console.error('❌ Greška pri preuzimanju sličnih filmova:', error);
    res.status(500).json({
      success: false,
      message: 'Došlo je do greške pri preuzimanju sličnih filmova!',
      error: error.message
    });
  }
};

// Dodaj ocenu filmu
export const addRating = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { korisnikId, ocena } = req.body;

    if (!korisnikId || !ocena) {
      res.status(400).json({
        success: false,
        message: 'Korisnik ID i ocena su obavezni!'
      });
      return;
    }

    const film = await Film.findById(id);

    if (!film) {
      res.status(404).json({
        success: false,
        message: 'Film nije pronađen!'
      });
      return;
    }

    // Dodaj ocenu
    film.ocene.push({
      korisnikId,
      vrednost: ocena,
      datum: new Date()
    });

    await film.save();

    res.status(200).json({
      success: true,
      message: 'Ocena je uspešno dodata!',
      data: film
    });
  } catch (error: any) {
    console.error('❌ Greška pri dodavanju ocene:', error);
    res.status(500).json({
      success: false,
      message: 'Došlo je do greške pri dodavanju ocene!',
      error: error.message
    });
  }
};

// Dodaj komentar filmu
export const addComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { korisnikId, tekst, ocena } = req.body;

    if (!korisnikId || !tekst) {
      res.status(400).json({
        success: false,
        message: 'Korisnik ID i tekst komentara su obavezni!'
      });
      return;
    }

    const film = await Film.findById(id);

    if (!film) {
      res.status(404).json({
        success: false,
        message: 'Film nije pronađen!'
      });
      return;
    }

    // Dodaj komentar
    film.komentari.push({
      korisnikId,
      tekst,
      ocena: ocena || null,
      datum: new Date()
    });

    await film.save();

    res.status(200).json({
      success: true,
      message: 'Komentar je uspešno dodat!',
      data: film
    });
  } catch (error: any) {
    console.error('❌ Greška pri dodavanju komentara:', error);
    res.status(500).json({
      success: false,
      message: 'Došlo je do greške pri dodavanju komentara!',
      error: error.message
    });
  }
};

// Iznajmi film
export const rentFilm = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { korisnikId, datumPocetka, datumZavrsetka } = req.body;

    if (!korisnikId || !datumPocetka || !datumZavrsetka) {
      res.status(400).json({
        success: false,
        message: 'Svi podaci su obavezni!'
      });
      return;
    }

    const film = await Film.findById(id);

    if (!film) {
      res.status(404).json({
        success: false,
        message: 'Film nije pronađen!'
      });
      return;
    }

    // Izračunaj broj aktivnih iznajmljivanja za ovaj film
    const activeRentals = await Iznajmljivanje.countDocuments({
      'film._id': (film._id as any).toString(),
      datumVracanja: { $gt: new Date() }
    });
    const available = film.ukupnoKomada - activeRentals;
    if (available <= 0) {
      res.status(400).json({
        success: false,
        message: 'Film trenutno nije dostupan!'
      });
      return;
    }

    // Kreiraj iznajmljivanje
    const iznajmljivanje = new Iznajmljivanje({
      filmId: id,
      korisnikId,
      datumPocetka: new Date(datumPocetka),
      datumZavrsetka: new Date(datumZavrsetka),
      status: 'aktivno'
    });

    await iznajmljivanje.save();

    // (Više se ne smanjuje dostupnoKomada, samo se kreira iznajmljivanje)

    res.status(200).json({
      success: true,
      message: 'Film je uspešno iznajmljen!',
      data: iznajmljivanje
    });
  } catch (error: any) {
    console.error('❌ Greška pri iznajmljivanju filma:', error);
    res.status(500).json({
      success: false,
      message: 'Došlo je do greške pri iznajmljivanju filma!',
      error: error.message
    });
  }
};

// POST /api/films/:id/iznajmi/byusername - Iznajmi film korišćenjem username
export const rentFilmByUsername = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { korisnik, datumPocetka, datumZavrsetka, brojDana, ukupnaCena, brojKartice } = req.body;

    if (!korisnik || !datumPocetka || !datumZavrsetka || !brojDana || !ukupnaCena || !brojKartice) {
      res.status(400).json({
        success: false,
        message: 'Svi podaci su obavezni!'
      });
      return;
    }

    const film = await Film.findById(id);

    if (!film) {
      res.status(404).json({
        success: false,
        message: 'Film nije pronađen!'
      });
      return;
    }

    // Izračunaj broj aktivnih iznajmljivanja za ovaj film
    const activeRentals = await Iznajmljivanje.countDocuments({
      'film._id': (film._id as any).toString(),
      datumVracanja: { $gt: new Date() }
    });
    const available = film.ukupnoKomada - activeRentals;
    if (available <= 0) {
      res.status(400).json({
        success: false,
        message: 'Film trenutno nije dostupan!'
      });
      return;
    }

    // Proveri da li već postoji iznajmljivanje za ovog korisnika i film u preklapajućem periodu
    const datumPocetkaDate = new Date(datumPocetka);
    const datumZavrsetkaDate = new Date(datumZavrsetka);
    const overlapping = await Iznajmljivanje.findOne({
      'korisnik': korisnik,
      'film._id': (film._id as any).toString(),
      $or: [
        {
          // Novi period počinje tokom postojećeg iznajmljivanja
          datumIznajmljivanja: { $lte: datumPocetkaDate },
          datumVracanja: { $gt: datumPocetkaDate }
        },
        {
          // Novi period završava tokom postojećeg iznajmljivanja
          datumIznajmljivanja: { $lt: datumZavrsetkaDate },
          datumVracanja: { $gte: datumZavrsetkaDate }
        },
        {
          // Novi period potpuno obuhvata postojeće iznajmljivanje
          datumIznajmljivanja: { $gte: datumPocetkaDate },
          datumVracanja: { $lte: datumZavrsetkaDate }
        }
      ]
    });
    if (overlapping) {
      res.status(400).json({
        success: false,
        message: 'Već postoji iznajmljivanje za ovaj film u izabranom periodu!'
      });
      return;
    }

    // Kreiraj iznajmljivanje sa strukturom koja odgovara modelu
    const iznajmljivanje = new Iznajmljivanje({
      korisnik: korisnik,
      film: {
        _id: (film._id as any).toString(),
        naslov: film.naslov,
        poster: film.poster,
        zanr: film.zanr
      },
      datumIznajmljivanja: new Date(datumPocetka),
      datumVracanja: new Date(datumZavrsetka),
      brojKartice: brojKartice,
      cenaDnevno: film.cenaDnevno,
      ukupnaCena: ukupnaCena,
      brojDana: brojDana
    });

    await iznajmljivanje.save();

    // (Više se ne smanjuje dostupnoKomada, samo se kreira iznajmljivanje)

    res.status(200).json({
      success: true,
      message: 'Film je uspešno iznajmljen!',
      data: iznajmljivanje
    });
  } catch (error: any) {
    console.error('❌ Greška pri iznajmljivanju filma:', error);
    res.status(500).json({
      success: false,
      message: 'Došlo je do greške pri iznajmljivanju filma!',
      error: error.message
    });
  }
};

// Proveri dostupnost filma
export const checkAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const film = await Film.findById(id);

    if (!film) {
      res.status(404).json({
        success: false,
        message: 'Film nije pronađen!'
      });
      return;
    }

    // Izračunaj broj aktivnih iznajmljivanja za ovaj film
    const activeRentals = await Iznajmljivanje.countDocuments({
      'film._id': (film._id as any).toString(),
      datumVracanja: { $gt: new Date() }
    });
    const available = film.ukupnoKomada - activeRentals;
    res.status(200).json({
      success: true,
      available: available > 0,
      count: available
    });
  } catch (error: any) {
    console.error('❌ Greška pri proveri dostupnosti:', error);
    res.status(500).json({
      success: false,
      message: 'Došlo je do greške pri proveri dostupnosti!',
      error: error.message
    });
  }
};

// Preuzmi filmove po režiseru
export const getFilmsByDirector = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reziser } = req.params;

    const films = await Film.find({
      reziser: { $in: [reziser] }
    }).sort({ godina: -1 });

    res.status(200).json({
      success: true,
      count: films.length,
      data: films
    });
  } catch (error: any) {
    console.error('❌ Greška pri preuzimanju filmova po režiseru:', error);
    res.status(500).json({
      success: false,
      message: 'Došlo je do greške pri preuzimanju filmova!',
      error: error.message
    });
  }
};

// Preuzmi filmove po glumcu
export const getFilmsByActor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { glumac } = req.params;

    const films = await Film.find({
      glumci: { $in: [glumac] }
    }).sort({ godina: -1 });

    res.status(200).json({
      success: true,
      count: films.length,
      data: films
    });
  } catch (error: any) {
    console.error('❌ Greška pri preuzimanju filmova po glumcu:', error);
    res.status(500).json({
      success: false,
      message: 'Došlo je do greške pri preuzimanju filmova!',
      error: error.message
    });
  }
};

// Preuzmi najbolje ocenjene filmove
export const getTopRatedFilms = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const films = await Film.find({
      ocene: { $exists: true, $ne: [] }
    });

    // Izračunaj prosečne ocene i sortiraj
    const filmsWithAverage = films.map(film => {
      const sum = film.ocene.reduce((acc: number, ocena: any) => {
        return acc + (typeof ocena === 'number' ? ocena : ocena.vrednost || 0);
      }, 0);
      const average = film.ocene.length > 0 ? sum / film.ocene.length : 0;
      
      return {
        ...film.toObject(),
        averageRating: average
      };
    });

    filmsWithAverage.sort((a, b) => b.averageRating - a.averageRating);

    res.status(200).json({
      success: true,
      count: filmsWithAverage.slice(0, limit).length,
      data: filmsWithAverage.slice(0, limit)
    });
  } catch (error: any) {
    console.error('❌ Greška pri preuzimanju top filmova:', error);
    res.status(500).json({
      success: false,
      message: 'Došlo je do greške pri preuzimanju top filmova!',
      error: error.message
    });
  }
};

// Preuzmi najnovije filmove
export const getNewestFilms = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const films = await Film.find()
      .sort({ godina: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: films.length,
      data: films
    });
  } catch (error: any) {
    console.error('❌ Greška pri preuzimanju najnovijih filmova:', error);
    res.status(500).json({
      success: false,
      message: 'Došlo je do greške pri preuzimanju najnovijih filmova!',
      error: error.message
    });
  }
};

// PUT /api/films/:id - Ažuriraj film (admin only)
export const updateFilm = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Pronađi film
    const film = await Film.findById(id);
    if (!film) {
      res.status(404).json({
        success: false,
        message: 'Film nije pronađen!'
      });
      return;
    }

    // Validacija - proveri da li dostupnoKomada ne prelazi ukupnoKomada
    if (updateData.dostupnoKomada !== undefined && updateData.ukupnoKomada !== undefined) {
      if (updateData.dostupnoKomada > updateData.ukupnoKomada) {
        res.status(400).json({
          success: false,
          message: 'Dostupno komada ne može biti veće od ukupnog broja komada!'
        });
        return;
      }
    }

    // Ažuriraj film
    const updatedFilm = await Film.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Film uspešno ažuriran!',
      data: updatedFilm
    });
  } catch (error: any) {
    console.error('❌ Greška pri ažuriranju filma:', error);
    res.status(500).json({
      success: false,
      message: 'Došlo je do greške pri ažuriranju filma!',
      error: error.message
    });
  }
};

// DELETE /api/films/:id - Obriši film (admin only)
export const deleteFilm = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Proveri da li film postoji
    const film = await Film.findById(id);
    if (!film) {
      res.status(404).json({
        success: false,
        message: 'Film nije pronađen!'
      });
      return;
    }

    // Proveri da li postoje aktivna iznajmljivanja za ovaj film
    const aktivnaIznajmljivanja = await Iznajmljivanje.find({
      film: id,
      status: 'aktivno'
    });

    if (aktivnaIznajmljivanja.length > 0) {
      res.status(400).json({
        success: false,
        message: `Ne možete obrisati film jer postoji ${aktivnaIznajmljivanja.length} aktivnih iznajmljivanja!`
      });
      return;
    }

    // Obriši film
    await Film.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Film uspešno obrisan!'
    });
  } catch (error: any) {
    console.error('❌ Greška pri brisanju filma:', error);
    res.status(500).json({
      success: false,
      message: 'Došlo je do greške pri brisanju filma!',
      error: error.message
    });
  }
};

// POST /api/films/:id/ocene/byusername - Dodaj ocenu filmu korišćenjem username
export const addRatingByUsername = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { korisnik, vrednost } = req.body;

    if (!korisnik || !vrednost) {
      res.status(400).json({
        success: false,
        message: 'Korisnik i vrednost su obavezni!'
      });
      return;
    }

    const film = await Film.findById(id);

    if (!film) {
      res.status(404).json({
        success: false,
        message: 'Film nije pronađen!'
      });
      return;
    }

    // Proveri da li je korisnik već ocenio film
    const existingRating = film.ocene.find((o: any) => o.korisnik === korisnik);
    
    if (existingRating) {
      res.status(400).json({
        success: false,
        message: 'Korisnik je već ocenio ovaj film!'
      });
      return;
    }

    // Dodaj ocenu
    film.ocene.push({
      korisnik,
      ocena: vrednost,
      datum: new Date()
    });

    await film.save();

    res.status(200).json({
      success: true,
      message: 'Ocena je uspešno dodata!',
      data: film
    });
  } catch (error: any) {
    console.error('❌ Greška pri dodavanju ocene:', error);
    res.status(500).json({
      success: false,
      message: 'Došlo je do greške pri dodavanju ocene!',
      error: error.message
    });
  }
};

// POST /api/films/:id/komentari/byusername - Dodaj komentar filmu korišćenjem username
export const addCommentByUsername = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { korisnik, tekst } = req.body;

    if (!korisnik || !tekst) {
      res.status(400).json({
        success: false,
        message: 'Korisnik i tekst komentara su obavezni!'
      });
      return;
    }

    const film = await Film.findById(id);

    if (!film) {
      res.status(404).json({
        success: false,
        message: 'Film nije pronađen!'
      });
      return;
    }

    // Dodaj komentar
    film.komentari.push({
      korisnik,
      tekst,
      datum: new Date()
    });

    await film.save();

    res.status(200).json({
      success: true,
      message: 'Komentar je uspešno dodat!',
      data: film
    });
  } catch (error: any) {
    console.error('❌ Greška pri dodavanju komentara:', error);
    res.status(500).json({
      success: false,
      message: 'Došlo je do greške pri dodavanju komentara!',
      error: error.message
    });
  }
};
