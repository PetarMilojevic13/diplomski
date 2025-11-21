# 💳 Validacija Kreditne Kartice - Dokumentacija

## 📋 Pregled funkcionalnosti

Sistem za iznajmljivanje filmova sada zahteva unos **validnog broja kreditne kartice** kako bi se proces iznajmljivanja mogao završiti.

---

## ✅ Pravila Validacije

### 🔵 **Diners Club**
- **Dužina:** Tačno **15 cifara**
- **Prefiksi:** Mora počinjati sa:
  - `300`
  - `301`
  - `302`
  - `303`
  - `36`
  - `38`

### 🔴 **MasterCard**
- **Dužina:** Tačno **16 cifara**
- **Prefiksi:** Mora počinjati sa:
  - `51`
  - `52`
  - `53`
  - `54`
  - `55`

### 🟡 **Visa**
- **Dužina:** Tačno **16 cifara**
- **Prefiksi:** Mora počinjati sa:
  - `4539`
  - `4556`
  - `4916`
  - `4532`
  - `4929`
  - `4485`
  - `4716`

---

## 🎯 Kako radi validacija?

### 1. **Real-time validacija**
- Validacija se izvršava **prilikom svakog unosa** (`input` event)
- Sistem automatski **uklanja sve karaktere osim cifara**
- Ograničava unos na **maksimalno 16 cifara**

### 2. **Vizuelni feedback**
Korisnik dobija **trenutni vizuelni feedback**:

#### ⏳ **Tokom unosa** (manje od 15 cifara):
- Neutralno polje
- Poruka: "Unesite kompletan broj kartice"

#### ❌ **Nevažeći broj** (15+ cifara ali ne zadovoljava pravila):
- **Crveno polje** sa crvenim border-om
- Poruka: "❌ Nevažeći broj kartice"
- Dugme "Potvrdi iznajmljivanje" je **onemogućeno**

#### ✅ **Važeći broj** (zadovoljava sva pravila):
- **Zeleno polje** sa zelenim border-om
- **Badge sa tipom kartice** (Visa/MasterCard/Diners) se pojavljuje u input polju
- Poruka: "✅ Važeći [tip] broj"
- Dugme "Potvrdi iznajmljivanje" postaje **aktivno**

---

## 🔐 Sigurnost

### Maskiranje broja kartice:
Prilikom potvrde i nakon uspešnog iznajmljivanja, broj kartice se **maskira**:
- **Prikaz:** `Visa **** 1234` (prikazuju se samo poslednje 4 cifre)
- **Čuva se:** Tip kartice (Visa, MasterCard, Diners)

### Validacija na više nivoa:
1. **Frontend validacija** (TypeScript)
   - Provera dužine
   - Provera prefiksa
   - Real-time feedback

2. **HTML validacija** (required atribut)
   - Polje mora biti popunjeno

3. **Button disable** logika
   - Dugme je onemogućeno dok kartica nije važeća

---

## 🧪 Testiranje

### Koraci za testiranje:

1. **Prijavite se kao korisnik**
   - Username: `petar`
   - Password: `petar`

2. **Idite na stranicu nekog filma**
   - Npr. Shawshank Redemption

3. **Kliknite "Iznajmi film"**
   - Mora biti dostupno (dostupnoKomada > 0)

4. **Popunite formu:**
   - Datum početka (minimum: sutra)
   - Datum kraja (minimum: dan posle početka)
   - Broj kartice (probajte test brojeve iz `TEST_KARTICE.md`)

5. **Pratite validaciju:**
   - Tokom unosa - neutralno
   - Nevažeći broj - crveno polje
   - Važeći broj - zeleno polje + badge

6. **Potvrdite iznajmljivanje**
   - Prikazuje se confirm dialog sa maskiranjem kartice
   - Nakon potvrde - success poruka sa tipom kartice

---

## 📊 Flow Chart

\`\`\`
Korisnik otvara stranicu filma
         ↓
Klikne "Iznajmi film" (provera: isLoggedIn)
         ↓
Otvara se modal
         ↓
Bira datume početka i kraja
         ↓
Unosi broj kreditne kartice
         ↓
    [VALIDACIJA]
         ↓
    ┌────┴────┐
    ↓         ↓
NEVAŽEĆI   VAŽEĆI
    ↓         ↓
Crveno    Zeleno
Disabled   Active
    ↓         ↓
    └────┬────┘
         ↓
Klikne "Potvrdi iznajmljivanje"
         ↓
Confirm dialog (sa maskiranjem)
         ↓
    [POTVRDA]
         ↓
Backend poziv (simulacija)
         ↓
Success poruka + zatvaranje modala
         ↓
Film dostupnoKomada--
\`\`\`

---

## 🛠️ Implementacija

### TypeScript (film.component.ts)

**Properties:**
\`\`\`typescript
cardNumber: string = '';       // Broj kartice (cifre)
cardType: string = '';         // 'visa', 'mastercard', 'diners'
isCardValid: boolean = false;  // Da li je kartica validna
\`\`\`

**Key Methods:**
\`\`\`typescript
onCardNumberInput(): void {
  // Uklanja sve osim cifara
  // Ograničava na 16 cifara
  // Poziva validateCardNumber()
}

validateCardNumber(): void {
  // Provera dužine (15 ili 16)
  // Provera prefiksa (300-303, 36, 38, 51-55, 4xxx)
  // Set cardType ('diners', 'mastercard', 'visa')
  // Set isCardValid (true/false)
}

confirmRental(): void {
  // Dodaje validaciju: if (!isCardValid) return;
  // Prikazuje tip kartice u confirm dialogu
}

closeRentalModal(): void {
  // Reset cardNumber, cardType, isCardValid
}
\`\`\`

### HTML (film.component.html)

**Card Input Field:**
\`\`\`html
<div class="card-input-wrapper">
  <input
    type="text"
    [class.valid]="isCardValid"
    [class.invalid]="cardNumber.length >= 15 && !isCardValid"
    [(ngModel)]="cardNumber"
    (input)="onCardNumberInput()"
    maxlength="16" />
  
  @if (cardType) {
    <div class="card-icon">
      <span class="card-badge visa-badge">VISA</span>
    </div>
  }
</div>
\`\`\`

**Button Disable:**
\`\`\`html
<button
  [disabled]="!rentalStartDate || !rentalEndDate || !isCardValid || totalDays < 1"
  (click)="confirmRental()">
  ✅ Potvrdi iznajmljivanje
</button>
\`\`\`

### CSS (film.component.css)

**Visual States:**
\`\`\`css
.card-input.valid {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.05);
}

.card-input.invalid {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}
\`\`\`

**Card Badges:**
\`\`\`css
.visa-badge {
  background: linear-gradient(135deg, #1a1f71 0%, #0066b2 100%);
}

.mastercard-badge {
  background: linear-gradient(135deg, #eb001b 0%, #f79e1b 100%);
}

.diners-badge {
  background: linear-gradient(135deg, #0079be 0%, #00558c 100%);
}
\`\`\`

---

## 🚀 Prednosti implementacije

✅ **Real-time validacija** - korisnik odmah zna da li je broj validan
✅ **Vizuelni feedback** - jasno razlikovanje važećih/nevažećih brojeva
✅ **Tip kartice prikaz** - automatsko prepoznavanje Visa/MasterCard/Diners
✅ **Maskiranje** - prikaz samo poslednje 4 cifre u potvrdi
✅ **Disabled button** - sprečava submit sa nevažećom karticom
✅ **Čist UI** - CSS badges umesto slika
✅ **Jednostavno testiranje** - lista test brojeva u `TEST_KARTICE.md`

---

## 📝 TODO (Backend integracija)

Kada budeš povezivao sa backend-om:

1. **Dodaj API endpoint** za validaciju kartice na serveru
2. **Enkriptuj** broj kartice pre slanja
3. **Integriši payment gateway** (Stripe, PayPal, itd.)
4. **Čuvaj transakcije** u bazi (sa maskiranjem)
5. **Email notifikacija** nakon uspešnog plaćanja
6. **Refund opcija** ako korisnik otkaže

---

**Autor:** GitHub Copilot
**Datum:** 12.11.2025.
