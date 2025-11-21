import mongoose from 'mongoose';
declare const _default: mongoose.Model<{
    kor_ime: string;
    lozinka: string;
    ime: string;
    prezime: string;
    pol: "M" | "Ž";
    adresa: string;
    telefon: string;
    email: string;
    profileImage: string;
    status: number;
    requestDate: NativeDate;
    processedDate: NativeDate;
    processedBy: mongoose.Types.ObjectId;
    rejectionReason: string;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    kor_ime: string;
    lozinka: string;
    ime: string;
    prezime: string;
    pol: "M" | "Ž";
    adresa: string;
    telefon: string;
    email: string;
    profileImage: string;
    status: number;
    requestDate: NativeDate;
    processedDate: NativeDate;
    processedBy: mongoose.Types.ObjectId;
    rejectionReason: string;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    kor_ime: string;
    lozinka: string;
    ime: string;
    prezime: string;
    pol: "M" | "Ž";
    adresa: string;
    telefon: string;
    email: string;
    profileImage: string;
    status: number;
    requestDate: NativeDate;
    processedDate: NativeDate;
    processedBy: mongoose.Types.ObjectId;
    rejectionReason: string;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    kor_ime: string;
    lozinka: string;
    ime: string;
    prezime: string;
    pol: "M" | "Ž";
    adresa: string;
    telefon: string;
    email: string;
    profileImage: string;
    status: number;
    requestDate: NativeDate;
    processedDate: NativeDate;
    processedBy: mongoose.Types.ObjectId;
    rejectionReason: string;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    kor_ime: string;
    lozinka: string;
    ime: string;
    prezime: string;
    pol: "M" | "Ž";
    adresa: string;
    telefon: string;
    email: string;
    profileImage: string;
    status: number;
    requestDate: NativeDate;
    processedDate: NativeDate;
    processedBy: mongoose.Types.ObjectId;
    rejectionReason: string;
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    kor_ime: string;
    lozinka: string;
    ime: string;
    prezime: string;
    pol: "M" | "Ž";
    adresa: string;
    telefon: string;
    email: string;
    profileImage: string;
    status: number;
    requestDate: NativeDate;
    processedDate: NativeDate;
    processedBy: mongoose.Types.ObjectId;
    rejectionReason: string;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=registrationRequest.d.ts.map