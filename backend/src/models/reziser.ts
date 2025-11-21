import mongoose, { Schema, Document } from 'mongoose';

export interface IReziser extends Document {
  ime: string;
  biografija: string;
  profilnaSlika: string;
  datumRodjenja: string;
  mestoRodjenja: string;
  nagrade: string[];
  aktivanOd: number;
  aktivanDo?: number;
  socialMedia?: {
    imdb?: string;
    rottenTomatoes?: string;
  };
  zanimljivosti?: string[];
  filmovi?: mongoose.Types.ObjectId[];
}

const ReziserSchema: Schema = new Schema({
  ime: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
  biografija: { 
    type: String, 
    required: true 
  },
  profilnaSlika: { 
    type: String, 
    required: true 
  },
  datumRodjenja: { 
    type: String, 
    required: true 
  },
  mestoRodjenja: { 
    type: String, 
    required: true 
  },
  nagrade: [{ 
    type: String 
  }],
  aktivanOd: { 
    type: Number, 
    required: true 
  },
  aktivanDo: { 
    type: Number 
  },
  socialMedia: {
    imdb: { type: String },
    rottenTomatoes: { type: String }
  },
  zanimljivosti: [{ 
    type: String 
  }],
  filmovi: [{
    type: Schema.Types.ObjectId,
    ref: 'Film'
  }]
}, {
  timestamps: true
});

export default mongoose.model<IReziser>('Reziser', ReziserSchema, 'reziseri');
