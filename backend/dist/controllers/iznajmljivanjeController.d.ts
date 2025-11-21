import { Request, Response } from 'express';
export declare const getAllIznajmljivanja: (req: Request, res: Response) => Promise<void>;
export declare const getIznajmljivanjaByKorisnik: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAktivnaIznajmljivanja: (req: Request, res: Response) => Promise<void>;
export declare const createIznajmljivanje: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const vratiIznajmljivanje: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getStatistikaIznajmljivanja: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteIznajmljivanje: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const checkRentalConflict: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getRentalStatisticsAdmin: (req: Request, res: Response) => Promise<void>;
export declare const getMonthlyRentalTrends: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=iznajmljivanjeController.d.ts.map