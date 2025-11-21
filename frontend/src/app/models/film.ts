// Enum za žanrove filmova
export enum Zanr {
  AKCIJA = 'Akcija',
  AVANTURA = 'Avantura',
  KOMEDIJA = 'Komedija',
  DRAMA = 'Drama',
  HOROR = 'Horor',
  TRILER = 'Triler',
  NAUCNA_FANTASTIKA = 'Naučna fantastika',
  FANTAZIJA = 'Fantazija',
  ROMANSA = 'Romansa',
  KRIMI = 'Krimi',
  MISTERIJA = 'Misterija',
  ANIMIRANI = 'Animirani',
  BIOGRAFSKI = 'Biografski',
  RATNI = 'Ratni',
  VESTERN = 'Vestern',
  MUZICKI = 'Muzički',
  PORODICNI = 'Porodični',
  ISTORIJSKI = 'Istorijski'
}

// Helper funkcija za dobijanje svih žanrova kao niz stringova
export function getAllZanrovi(): string[] {
  return Object.values(Zanr);
}

// Mapa za konverziju engleskih žanrova u srpske
export const ZANR_MAPA: { [key: string]: string } = {
  // Engleski -> Srpski
  'Action': 'Akcija',
  'Adventure': 'Avantura',
  'Comedy': 'Komedija',
  'Drama': 'Drama',
  'Horror': 'Horor',
  'Thriller': 'Triler',
  'Sci-Fi': 'Naučna fantastika',
  'Science Fiction': 'Naučna fantastika',
  'Fantasy': 'Fantazija',
  'Romance': 'Romansa',
  'Crime': 'Krimi',
  'Mystery': 'Misterija',
  'Animation': 'Animirani',
  'Biography': 'Biografski',
  'War': 'Ratni',
  'Western': 'Vestern',
  'Music': 'Muzički',
  'Musical': 'Muzički',
  'Family': 'Porodični',
  'History': 'Istorijski',
  // Srpske verzije (već standardizovane)
  'Akcija': 'Akcija',
  'Avantura': 'Avantura',
  'Komedija': 'Komedija',
  'Horor': 'Horor',
  'Triler': 'Triler',
  'Naučna fantastika': 'Naučna fantastika',
  'Fantazija': 'Fantazija',
  'Romansa': 'Romansa',
  'Krimi': 'Krimi',
  'Misterija': 'Misterija',
  'Animirani': 'Animirani',
  'Biografski': 'Biografski',
  'Ratni': 'Ratni',
  'Vestern': 'Vestern',
  'Muzički': 'Muzički',
  'Porodični': 'Porodični',
  'Istorijski': 'Istorijski'
};

// Helper funkcija za konvertovanje engleskog žanra u srpski
export function konvertujZanr(engleskiZanr: string): string {
  return ZANR_MAPA[engleskiZanr] || engleskiZanr;
}

export class Film {
  _id?: string;
  naslov: string = '';
  opis: string = '';
  poster: string = ''; //base64 slika ili URL
  trajanjeMin: number = 0;
  godina: number = new Date().getFullYear();
  zanr: Zanr[] = []; // Sada koristi Zanr enum umesto string[]
  reziser: string[] = []; // Niz režisera
  glumci: string[] = [];
  trailerUrl: string = ''; // YouTube embed URL npr: 'https://www.youtube.com/embed/YoHD9XEInc0'
  ocene: any[] = []; // Niz objekata ocena
  komentari: any[] = []; // Niz objekata komentara
  ukupnoKomada: number = 0; // Ukupan broj primeraka filma
  cenaDnevno: number = 0; // Cena iznajmljivanja za 1 dan (u dinarima)

  // Metadata polja
  produkcija?: string; // Produkcijska kuća (npr. "Warner Bros. Pictures")
  budzet?: string; // Budžet filma (npr. "$160 million")
  boxOffice?: string; // Box Office zarada (npr. "$836 million")
  jezik?: string; // Jezik filma (npr. "Engleski")
  titlovi?: string[]; // Dostupni titlovi (npr. ["Srpski", "Engleski"])
}
