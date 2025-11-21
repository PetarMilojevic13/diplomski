import mongoose, { Schema, Document } from 'mongoose';

// Interface za Film dokument
export interface IFilm extends Document {
  naslov: string;
  opis: string;
  poster: string;
  trajanjeMin: number;
  godina: number;
  zanr: string[];
  reziser: string[];
  glumci: string[];
  trailerUrl: string;
  ocene: any[];
  komentari: any[];
  ukupnoKomada: number;
  cenaDnevno: number;
  produkcija?: string;
  budzet?: string;
  boxOffice?: string;
  jezik?: string;
  titlovi?: string[];
}

// Mongoose šema za Film
const FilmSchema: Schema = new Schema(
  {
    naslov: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    opis: {
      type: String,
      required: true
    },
    poster: {
      type: String,
      required: true
    },
    trajanjeMin: {
      type: Number,
      required: true,
      min: 1
    },
    godina: {
      type: Number,
      required: true,
      min: 1888,
      max: new Date().getFullYear() + 10
    },
    zanr: {
      type: [String],
      required: true,
      validate: {
        validator: function(v: string[]) {
          return v && v.length > 0;
        },
        message: 'Film mora imati bar jedan žanr'
      }
    },
    reziser: {
      type: [String],
      required: true,
      validate: {
        validator: function(v: string[]) {
          return v && v.length > 0;
        },
        message: 'Film mora imati bar jednog režisera'
      }
    },
    glumci: {
      type: [String],
      default: []
    },
    trailerUrl: {
      type: String,
      default: ''
    },
    ocene: {
      type: [Schema.Types.Mixed],
      default: []
    },
    komentari: {
      type: [Schema.Types.Mixed],
      default: []
    },
    ukupnoKomada: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    cenaDnevno: {
      type: Number,
      required: true,
      min: 0
    },
    produkcija: {
      type: String,
      default: ''
    },
    budzet: {
      type: String,
      default: ''
    },
    boxOffice: {
      type: String,
      default: ''
    },
    jezik: {
      type: String,
      default: ''
    },
    titlovi: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true,
    collection: 'films'
  }
);

// Indeksi za optimizaciju pretrage
// naslov indeks je već definisan u šemi sa "index: true"
FilmSchema.index({ godina: -1 });
FilmSchema.index({ zanr: 1 });
FilmSchema.index({ reziser: 1 });

// Export modela
export default mongoose.model<IFilm>('Film', FilmSchema);
