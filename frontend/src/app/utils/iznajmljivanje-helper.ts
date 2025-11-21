/**
 * Helper funkcije za izračunavanje statusa iznajmljivanja na osnovu datuma
 */

import { Iznajmljivanje } from '../models/iznajmljivanje';

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
export function isRentalActive(iznajmljivanje: Iznajmljivanje): boolean {
  return calculateRentalStatus(
    iznajmljivanje.datumIznajmljivanja,
    iznajmljivanje.datumVracanja
  ).isAktivno;
}

/**
 * Provera da li je iznajmljivanje vraćeno
 */
export function isRentalReturned(iznajmljivanje: Iznajmljivanje): boolean {
  return calculateRentalStatus(
    iznajmljivanje.datumIznajmljivanja,
    iznajmljivanje.datumVracanja
  ).isVraceno;
}

/**
 * Provera da li je iznajmljivanje planirano (još nije počelo)
 */
export function isRentalPlanned(iznajmljivanje: Iznajmljivanje): boolean {
  return calculateRentalStatus(
    iznajmljivanje.datumIznajmljivanja,
    iznajmljivanje.datumVracanja
  ).isPlanirano;
}

/**
 * Dobij string reprezentaciju statusa
 */
export function getRentalStatusString(iznajmljivanje: Iznajmljivanje): string {
  const status = calculateRentalStatus(
    iznajmljivanje.datumIznajmljivanja,
    iznajmljivanje.datumVracanja
  );

  if (status.isVraceno) return 'vraceno';
  if (status.isAktivno) return 'aktivno';
  if (status.isPlanirano) return 'planirano';

  return 'nepoznato';
}
