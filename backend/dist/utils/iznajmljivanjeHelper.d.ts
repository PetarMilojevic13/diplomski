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
export declare function calculateRentalStatus(datumIznajmljivanja: Date, datumVracanja: Date): IznajmljivanjeStatus;
/**
 * Provera da li je iznajmljivanje aktivno
 */
export declare function isRentalActive(datumIznajmljivanja: Date, datumVracanja: Date): boolean;
/**
 * Provera da li je iznajmljivanje vraćeno
 */
export declare function isRentalReturned(datumIznajmljivanja: Date, datumVracanja: Date): boolean;
/**
 * Provera da li je iznajmljivanje planirano (još nije počelo)
 */
export declare function isRentalPlanned(datumIznajmljivanja: Date, datumVracanja: Date): boolean;
/**
 * Dobij string reprezentaciju statusa
 */
export declare function getRentalStatusString(datumIznajmljivanja: Date, datumVracanja: Date): string;
//# sourceMappingURL=iznajmljivanjeHelper.d.ts.map