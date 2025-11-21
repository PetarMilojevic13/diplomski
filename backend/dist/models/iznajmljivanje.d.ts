import mongoose from 'mongoose';
declare const _default: mongoose.Model<{
    korisnik: string;
    cenaDnevno: number;
    datumIznajmljivanja: NativeDate;
    datumVracanja: NativeDate;
    brojKartice: string;
    ukupnaCena: number;
    brojDana: number;
    film?: {
        _id: string;
        naslov: string;
        poster: string;
        zanr: string[];
    } | null;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    korisnik: string;
    cenaDnevno: number;
    datumIznajmljivanja: NativeDate;
    datumVracanja: NativeDate;
    brojKartice: string;
    ukupnaCena: number;
    brojDana: number;
    film?: {
        _id: string;
        naslov: string;
        poster: string;
        zanr: string[];
    } | null;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    korisnik: string;
    cenaDnevno: number;
    datumIznajmljivanja: NativeDate;
    datumVracanja: NativeDate;
    brojKartice: string;
    ukupnaCena: number;
    brojDana: number;
    film?: {
        _id: string;
        naslov: string;
        poster: string;
        zanr: string[];
    } | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    korisnik: string;
    cenaDnevno: number;
    datumIznajmljivanja: NativeDate;
    datumVracanja: NativeDate;
    brojKartice: string;
    ukupnaCena: number;
    brojDana: number;
    film?: {
        _id: string;
        naslov: string;
        poster: string;
        zanr: string[];
    } | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    korisnik: string;
    cenaDnevno: number;
    datumIznajmljivanja: NativeDate;
    datumVracanja: NativeDate;
    brojKartice: string;
    ukupnaCena: number;
    brojDana: number;
    film?: {
        _id: string;
        naslov: string;
        poster: string;
        zanr: string[];
    } | null;
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    korisnik: string;
    cenaDnevno: number;
    datumIznajmljivanja: NativeDate;
    datumVracanja: NativeDate;
    brojKartice: string;
    ukupnaCena: number;
    brojDana: number;
    film?: {
        _id: string;
        naslov: string;
        poster: string;
        zanr: string[];
    } | null;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=iznajmljivanje.d.ts.map