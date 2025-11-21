import { Zanr } from './film';

export class Iznajmljivanje {
  _id?: string;
  korisnik: string = ""; //kor_ime
  film: {
    _id: string;
    naslov: string;
    poster: string;
    zanr: Zanr[];
  } = { _id: "", naslov: "", poster: "", zanr: [] };
  datumIznajmljivanja: Date = new Date();
  datumVracanja: Date = new Date();
  brojKartice: string = "";
  cenaDnevno: number = 0;
  ukupnaCena: number = 0;
  brojDana: number = 0;
}
