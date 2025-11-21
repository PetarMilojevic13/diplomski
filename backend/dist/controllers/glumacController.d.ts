import { Request, Response } from 'express';
export declare const getAllGlumci: (req: Request, res: Response) => Promise<void>;
export declare const getGlumacById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getGlumacByIme: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getFilmoviZaGlumca: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getStatistikeGlumca: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createGlumac: (req: Request, res: Response) => Promise<void>;
export declare const updateGlumac: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteGlumac: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const searchGlumci: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=glumacController.d.ts.map