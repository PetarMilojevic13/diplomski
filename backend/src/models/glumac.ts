import mongoose from 'mongoose';

const Schema = mongoose.Schema;

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

export default mongoose.model('Glumac', Glumac, 'glumci');
