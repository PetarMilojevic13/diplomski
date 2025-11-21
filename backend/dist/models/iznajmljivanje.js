"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const Iznajmljivanje = new Schema({
    korisnik: {
        type: String,
        required: true
    },
    film: {
        _id: {
            type: String,
            required: true
        },
        naslov: {
            type: String,
            required: true
        },
        poster: {
            type: String,
            required: true
        },
        zanr: {
            type: [String],
            required: true
        }
    },
    datumIznajmljivanja: {
        type: Date,
        required: true,
        default: Date.now
    },
    datumVracanja: {
        type: Date,
        default: null
    },
    brojKartice: {
        type: String,
        required: true
    },
    cenaDnevno: {
        type: Number,
        required: true
    },
    ukupnaCena: {
        type: Number,
        required: true
    },
    brojDana: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Iznajmljivanje', Iznajmljivanje, 'iznajmljivanja');
//# sourceMappingURL=iznajmljivanje.js.map