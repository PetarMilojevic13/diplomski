import mongoose from 'mongoose';

const Schema = mongoose.Schema;

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

export default mongoose.model('Iznajmljivanje', Iznajmljivanje, 'iznajmljivanja');
