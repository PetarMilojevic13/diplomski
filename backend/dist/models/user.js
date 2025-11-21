"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const User = new Schema({
    kor_ime: {
        type: String,
        required: true,
        unique: true
    },
    lozinka: {
        type: String,
        required: true
    },
    ime: {
        type: String,
        required: true
    },
    prezime: {
        type: String,
        required: true
    },
    pol: {
        type: String,
        required: true,
        enum: ['M', 'Ž']
    },
    adresa: {
        type: String,
        required: true
    },
    telefon: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profileImage: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        required: true,
        enum: ['korisnik', 'admin'],
        default: 'korisnik'
    },
    status: {
        type: Number,
        required: true,
        default: 0 // 0 = pending, 1 = active, 2 = blocked
    },
    deactivated: {
        type: Number,
        required: true,
        default: 0 // 0 = active, 1 = deactivated
    },
    favorites: [{
            type: Schema.Types.ObjectId,
            ref: 'Film'
        }]
}, {
    timestamps: true // Dodaje createdAt i updatedAt automatski
});
exports.default = mongoose_1.default.model('User', User, 'users');
//# sourceMappingURL=user.js.map