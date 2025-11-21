export class RegistrationRequest {
  _id?: string;
  kor_ime: string = '';
  lozinka: string = '';
  ime: string = '';
  prezime: string = '';
  pol: string = '';
  adresa: string = '';
  telefon: string = '';
  email: string = '';
  profileImage?: string = ''; // base64 slika
  status: number = 0; // 0 = pending, 1 = approved, 2 = rejected
  requestDate: Date = new Date();
  processedDate?: Date;
  processedBy?: string; // Admin koji je obradio zahtev
  rejectionReason?: string; // Razlog odbijanja (opciono)
}
