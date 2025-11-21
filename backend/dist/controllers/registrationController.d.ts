import { Request, Response } from 'express';
/**
 * Registration Controller - Upravljanje registracijom novih korisnika
 * Korisnici se kreiraju direktno u Users kolekciji sa status=0 (pending)
 */
export declare const registerKorisnik: (req: Request, res: Response) => Promise<void>;
export declare const checkUsernameAvailability: (req: Request, res: Response) => Promise<void>;
export declare const checkEmailAvailability: (req: Request, res: Response) => Promise<void>;
export declare const getAllRegistrationRequests: (req: Request, res: Response) => Promise<void>;
export declare const getPendingRegistrationRequests: (req: Request, res: Response) => Promise<void>;
export declare const approveRegistrationRequest: (req: Request, res: Response) => Promise<void>;
export declare const rejectRegistrationRequest: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=registrationController.d.ts.map