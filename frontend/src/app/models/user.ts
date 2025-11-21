export class User {
  _id?: string
  kor_ime = ""
  lozinka = ""
  ime = ""
  prezime = ""
  pol = ""
  adresa = ""
  telefon = ""
  email = ""
  profileImage = "" //base64 slika
  type = ""
  status = 0
  deactivated = 0
  createdAt?: Date
  updatedAt?: Date
}
