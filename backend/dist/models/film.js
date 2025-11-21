"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Mongoose šema za Film
const FilmSchema = new mongoose_1.Schema({
    naslov: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    opis: {
        type: String,
        required: true
    },
    poster: {
        type: String,
        required: true
    },
    trajanjeMin: {
        type: Number,
        required: true,
        min: 1
    },
    godina: {
        type: Number,
        required: true,
        min: 1888,
        max: new Date().getFullYear() + 10
    },
    zanr: {
        type: [String],
        required: true,
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'Film mora imati bar jedan žanr'
        }
    },
    reziser: {
        type: [String],
        required: true,
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'Film mora imati bar jednog režisera'
        }
    },
    glumci: {
        type: [String],
        default: []
    },
    trailerUrl: {
        type: String,
        default: ''
    },
    ocene: {
        type: [mongoose_1.Schema.Types.Mixed],
        default: []
    },
    komentari: {
        type: [mongoose_1.Schema.Types.Mixed],
        default: []
    },
    ukupnoKomada: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    cenaDnevno: {
        type: Number,
        required: true,
        min: 0
    },
    produkcija: {
        type: String,
        default: ''
    },
    budzet: {
        type: String,
        default: ''
    },
    boxOffice: {
        type: String,
        default: ''
    },
    jezik: {
        type: String,
        default: ''
    },
    titlovi: {
        type: [String],
        default: []
    }
}, {
    timestamps: true,
    collection: 'films'
});
// Indeksi za optimizaciju pretrage
// naslov indeks je već definisan u šemi sa "index: true"
FilmSchema.index({ godina: -1 });
FilmSchema.index({ zanr: 1 });
FilmSchema.index({ reziser: 1 });
// Export modela
exports.default = mongoose_1.default.model('Film', FilmSchema);
//# sourceMappingURL=film.js.map