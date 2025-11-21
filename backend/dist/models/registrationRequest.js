"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const RegistrationRequest = new Schema({
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
    status: {
        type: Number,
        required: true,
        default: 0 // 0 = pending, 1 = approved, 2 = rejected
    },
    requestDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    processedDate: {
        type: Date,
        default: null
    },
    processedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    rejectionReason: {
        type: String,
        default: null
    }
}, {
    timestamps: true // Dodaje createdAt i updatedAt automatski
});
exports.default = mongoose_1.default.model('RegistrationRequest', RegistrationRequest, 'registrationRequests');
//# sourceMappingURL=registrationRequest.js.map