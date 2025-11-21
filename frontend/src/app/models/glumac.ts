export interface SocialMedia {
  imdb?: string;
  rottenTomatoes?: string;
}

export class Glumac {
  _id?: string;
  ime: string;
  biografija: string;
  datumRodjenja?: Date;
  mestoRodjenja?: string;
  profilnaSlika?: string; // URL do slike
  nagrade: string[]; // Lista nagrada (npr. "Oscar za najbolju sporednu ulogu 2020")
  aktivanOd?: number; // Godina kada je počeo karijeru
  aktivanDo?: number; // Godina kada je završio karijeru (opciono, ako je još aktivan)
  socialMedia?: SocialMedia; // Social media linkovi
  zanimljivosti: string[]; // Fun facts i trivia

  constructor(
    ime: string,
    biografija: string = '',
    datumRodjenja?: Date,
    mestoRodjenja?: string,
    profilnaSlika?: string,
    nagrade: string[] = [],
    aktivanOd?: number,
    aktivanDo?: number,
    socialMedia?: SocialMedia,
    zanimljivosti: string[] = []
  ) {
    this.ime = ime;
    this.biografija = biografija;
    this.datumRodjenja = datumRodjenja;
    this.mestoRodjenja = mestoRodjenja;
    this.profilnaSlika = profilnaSlika;
    this.nagrade = nagrade;
    this.aktivanOd = aktivanOd;
    this.aktivanDo = aktivanDo;
    this.socialMedia = socialMedia;
    this.zanimljivosti = zanimljivosti;
  }

  // Helper metoda za izračunavanje godina
  get godinaStarosti(): number | null {
    if (!this.datumRodjenja) return null;
    const danas = new Date();
    const rodjenje = new Date(this.datumRodjenja);
    let godine = danas.getFullYear() - rodjenje.getFullYear();
    const mesec = danas.getMonth() - rodjenje.getMonth();
    if (mesec < 0 || (mesec === 0 && danas.getDate() < rodjenje.getDate())) {
      godine--;
    }
    return godine;
  }

  // Helper metoda za prikaz inicijala (ako nema slike)
  get inicijali(): string {
    return this.ime
      .split(' ')
      .map(rec => rec[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  // Helper metoda za status aktivnosti
  get statusAktivnosti(): string {
    if (!this.aktivanOd) return 'Nepoznato';
    if (!this.aktivanDo) return `${this.aktivanOd} - danas`;
    return `${this.aktivanOd} - ${this.aktivanDo}`;
  }
}
