import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IFilm, {}, {}, {}, mongoose.Document<unknown, {}, IFilm, {}, {}> & IFilm & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=film.d.ts.map