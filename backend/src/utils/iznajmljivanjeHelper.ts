/**
 * Helper funkcije za izračunavanje statusa iznajmljivanja na osnovu datuma
 */

export interface IznajmljivanjeStatus {
  isAktivno: boolean;
  isVraceno: boolean;
  isPlanirano: boolean;
}

/**
 * Izračunaj status iznajmljivanja na osnovu trenutnog datuma i datuma početka/kraja
 * 
 * Pravila:
 * - Aktivno: trenutni datum >= datum početka && trenutni datum < datum kraja
 * - Vraćeno: trenutni datum >= datum kraja
 * - Planirano: trenutni datum < datum početka
 */
export function calculateRentalStatus(
  datumIznajmljivanja: Date,
  datumVracanja: Date
): IznajmljivanjeStatus {
  const danas = new Date();
  danas.setHours(0, 0, 0, 0);

  const pocetak = new Date(datumIznajmljivanja);
  pocetak.setHours(0, 0, 0, 0);

  const kraj = new Date(datumVracanja);
  kraj.setHours(0, 0, 0, 0);

  const isPlanirano = danas < pocetak;
  const isVraceno = danas >= kraj;
  const isAktivno = danas >= pocetak && danas < kraj;

  return {
    isAktivno,
    isVraceno,
    isPlanirano
  };
}

/**
 * Provera da li je iznajmljivanje aktivno
 */
export function isRentalActive(datumIznajmljivanja: Date, datumVracanja: Date): boolean {
  return calculateRentalStatus(datumIznajmljivanja, datumVracanja).isAktivno;
}

/**
 * Provera da li je iznajmljivanje vraćeno
 */
export function isRentalReturned(datumIznajmljivanja: Date, datumVracanja: Date): boolean {
  return calculateRentalStatus(datumIznajmljivanja, datumVracanja).isVraceno;
}

/**
 * Provera da li je iznajmljivanje planirano (još nije počelo)
 */
export function isRentalPlanned(datumIznajmljivanja: Date, datumVracanja: Date): boolean {
  return calculateRentalStatus(datumIznajmljivanja, datumVracanja).isPlanirano;
}

/**
 * Dobij string reprezentaciju statusa
 */
export function getRentalStatusString(datumIznajmljivanja: Date, datumVracanja: Date): string {
  const status = calculateRentalStatus(datumIznajmljivanja, datumVracanja);
  
  if (status.isVraceno) return 'vraceno';
  if (status.isAktivno) return 'aktivno';
  if (status.isPlanirano) return 'planirano';
  
  return 'nepoznato';
}
