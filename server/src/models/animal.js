
import mongoose from 'mongoose';

const animalSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  
    name: {
      type: String,
      required: true,
      trim: true,
    },
    
    species: {
      type: String,
      enum: ['DOG', 'CAT'],
      required: true,
    },
  
    breed: {
      type: String,
      required: true,
      trim: true,
    },
   
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE'],
      required: true,
    },
   
    birthDate: {
      type: Date,
      required: true,
    },
    
    description: {
      type: String,
      trim: true,
      default: '',
    },
   
    healthStatus: {
      type: String,
      trim: true,
      default: 'Zdravý, očkovaný',
    },
    
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
  }
);

export const AnimalModel = mongoose.model('Animal', animalSchema);