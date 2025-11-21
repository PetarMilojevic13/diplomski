export class Reziser {
  constructor(
    public ime: string,
    public biografija: string,
    public profilnaSlika: string,
    public datumRodjenja: string,
    public mestoRodjenja: string,
    public nagrade: string[],
    public aktivanOd: number,
    public aktivanDo?: number,
    public socialMedia?: {
      imdb?: string;
      rottenTomatoes?: string;
    },
    public zanimljivosti?: string[]
  ) {}

  get godine(): string {
    return this.aktivanDo
      ? `${this.aktivanOd} - ${this.aktivanDo}`
      : `${this.aktivanOd} - Present`;
  }

  get uzrast(): number {
    const rodjenje = new Date(this.datumRodjenja);
    const danas = new Date();
    let uzrast = danas.getFullYear() - rodjenje.getFullYear();
    const mesecRazlika = danas.getMonth() - rodjenje.getMonth();

    if (mesecRazlika < 0 || (mesecRazlika === 0 && danas.getDate() < rodjenje.getDate())) {
      uzrast--;
    }

    return uzrast;
  }
}
