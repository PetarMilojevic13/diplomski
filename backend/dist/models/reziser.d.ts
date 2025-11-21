import mongoose, { Document } from 'mongoose';
export interface IReziser extends Document {
    ime: string;
    biografija: string;
    profilnaSlika: string;
    datumRodjenja: string;
    mestoRodjenja: string;
    nagrade: string[];
    aktivanOd: number;
    aktivanDo?: number;
    socialMedia?: {
        imdb?: string;
        rottenTomatoes?: string;
    };
    zanimljivosti?: string[];
    filmovi?: mongoose.Types.ObjectId[];
}
declare const _default: mongoose.Model<IReziser, {}, {}, {}, mongoose.Document<unknown, {}, IReziser, {}, {}> & IReziser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=reziser.d.ts.map