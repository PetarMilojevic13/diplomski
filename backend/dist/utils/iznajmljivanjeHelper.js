"use strict";
/**
 * Helper funkcije za izračunavanje statusa iznajmljivanja na osnovu datuma
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRentalStatus = calculateRentalStatus;
exports.isRentalActive = isRentalActive;
exports.isRentalReturned = isRentalReturned;
exports.isRentalPlanned = isRentalPlanned;
exports.getRentalStatusString = getRentalStatusString;
/**
 * Izračunaj status iznajmljivanja na osnovu trenutnog datuma i datuma početka/kraja
 *
 * Pravila:
 * - Aktivno: trenutni datum >= datum početka && trenutni datum < datum kraja
 * - Vraćeno: trenutni datum >= datum kraja
 * - Planirano: trenutni datum < datum početka
 */
function calculateRentalStatus(datumIznajmljivanja, datumVracanja) {
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
function isRentalActive(datumIznajmljivanja, datumVracanja) {
    return calculateRentalStatus(datumIznajmljivanja, datumVracanja).isAktivno;
}
/**
 * Provera da li je iznajmljivanje vraćeno
 */
function isRentalReturned(datumIznajmljivanja, datumVracanja) {
    return calculateRentalStatus(datumIznajmljivanja, datumVracanja).isVraceno;
}
/**
 * Provera da li je iznajmljivanje planirano (još nije počelo)
 */
function isRentalPlanned(datumIznajmljivanja, datumVracanja) {
    return calculateRentalStatus(datumIznajmljivanja, datumVracanja).isPlanirano;
}
/**
 * Dobij string reprezentaciju statusa
 */
function getRentalStatusString(datumIznajmljivanja, datumVracanja) {
    const status = calculateRentalStatus(datumIznajmljivanja, datumVracanja);
    if (status.isVraceno)
        return 'vraceno';
    if (status.isAktivno)
        return 'aktivno';
    if (status.isPlanirano)
        return 'planirano';
    return 'nepoznato';
}
//# sourceMappingURL=iznajmljivanjeHelper.js.map