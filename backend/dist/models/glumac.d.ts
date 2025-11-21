import mongoose from 'mongoose';
declare const _default: mongoose.Model<{
    ime: string;
    biografija: string;
    mestoRodjenja: string;
    profilnaSlika: string;
    nagrade: string[];
    zanimljivosti: string[];
    datumRodjenja?: NativeDate | null;
    aktivanOd?: number | null;
    aktivanDo?: number | null;
    socialMedia?: {
        imdb: string;
        rottenTomatoes: string;
    } | null;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    ime: string;
    biografija: string;
    mestoRodjenja: string;
    profilnaSlika: string;
    nagrade: string[];
    zanimljivosti: string[];
    datumRodjenja?: NativeDate | null;
    aktivanOd?: number | null;
    aktivanDo?: number | null;
    socialMedia?: {
        imdb: string;
        rottenTomatoes: string;
    } | null;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    ime: string;
    biografija: string;
    mestoRodjenja: string;
    profilnaSlika: string;
    nagrade: string[];
    zanimljivosti: string[];
    datumRodjenja?: NativeDate | null;
    aktivanOd?: number | null;
    aktivanDo?: number | null;
    socialMedia?: {
        imdb: string;
        rottenTomatoes: string;
    } | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    ime: string;
    biografija: string;
    mestoRodjenja: string;
    profilnaSlika: string;
    nagrade: string[];
    zanimljivosti: string[];
    datumRodjenja?: NativeDate | null;
    aktivanOd?: number | null;
    aktivanDo?: number | null;
    socialMedia?: {
        imdb: string;
        rottenTomatoes: string;
    } | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    ime: string;
    biografija: string;
    mestoRodjenja: string;
    profilnaSlika: string;
    nagrade: string[];
    zanimljivosti: string[];
    datumRodjenja?: NativeDate | null;
    aktivanOd?: number | null;
    aktivanDo?: number | null;
    socialMedia?: {
        imdb: string;
        rottenTomatoes: string;
    } | null;
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    ime: string;
    biografija: string;
    mestoRodjenja: string;
    profilnaSlika: string;
    nagrade: string[];
    zanimljivosti: string[];
    datumRodjenja?: NativeDate | null;
    aktivanOd?: number | null;
    aktivanDo?: number | null;
    socialMedia?: {
        imdb: string;
        rottenTomatoes: string;
    } | null;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=glumac.d.ts.map