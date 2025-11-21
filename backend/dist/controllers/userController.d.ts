import { Request, Response } from 'express';
export declare const getAllUsers: (req: Request, res: Response) => Promise<void>;
export declare const getUserStatistics: (req: Request, res: Response) => Promise<void>;
export declare const getUserByUsername: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deactivateUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const activateUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserFavorites: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const addToFavorites: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const removeFromFavorites: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=userController.d.ts.map