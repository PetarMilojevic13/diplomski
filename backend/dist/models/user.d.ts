import mongoose from 'mongoose';
declare const _default: mongoose.Model<{
    kor_ime: string;
    type: "korisnik" | "admin";
    lozinka: string;
    ime: string;
    prezime: string;
    pol: "M" | "Ž";
    adresa: string;
    telefon: string;
    email: string;
    profileImage: string;
    status: number;
    deactivated: number;
    favorites: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    kor_ime: string;
    type: "korisnik" | "admin";
    lozinka: string;
    ime: string;
    prezime: string;
    pol: "M" | "Ž";
    adresa: string;
    telefon: string;
    email: string;
    profileImage: string;
    status: number;
    deactivated: number;
    favorites: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    kor_ime: string;
    type: "korisnik" | "admin";
    lozinka: string;
    ime: string;
    prezime: string;
    pol: "M" | "Ž";
    adresa: string;
    telefon: string;
    email: string;
    profileImage: string;
    status: number;
    deactivated: number;
    favorites: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    kor_ime: string;
    type: "korisnik" | "admin";
    lozinka: string;
    ime: string;
    prezime: string;
    pol: "M" | "Ž";
    adresa: string;
    telefon: string;
    email: string;
    profileImage: string;
    status: number;
    deactivated: number;
    favorites: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    kor_ime: string;
    type: "korisnik" | "admin";
    lozinka: string;
    ime: string;
    prezime: string;
    pol: "M" | "Ž";
    adresa: string;
    telefon: string;
    email: string;
    profileImage: string;
    status: number;
    deactivated: number;
    favorites: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    kor_ime: string;
    type: "korisnik" | "admin";
    lozinka: string;
    ime: string;
    prezime: string;
    pol: "M" | "Ž";
    adresa: string;
    telefon: string;
    email: string;
    profileImage: string;
    status: number;
    deactivated: number;
    favorites: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=user.d.ts.map