"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const Glumac = new Schema({
    ime: {
        type: String,
        required: true,
        trim: true
    },
    biografija: {
        type: String,
        default: ''
    },
    datumRodjenja: {
        type: Date
    },
    mestoRodjenja: {
        type: String,
        default: ''
    },
    profilnaSlika: {
        type: String,
        default: '' // URL do slike
    },
    nagrade: [{
            type: String
        }],
    aktivanOd: {
        type: Number // Godina kada je počeo karijeru
    },
    aktivanDo: {
        type: Number // Godina kada je završio karijeru (opciono)
    },
    socialMedia: {
        imdb: { type: String, default: '' },
        rottenTomatoes: { type: String, default: '' }
    },
    zanimljivosti: [{
            type: String
        }]
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Glumac', Glumac, 'glumci');
//# sourceMappingURL=glumac.js.map