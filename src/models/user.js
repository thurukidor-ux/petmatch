
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ['User', 'Breeder', 'Admin'],
      default: 'User',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    kennelName: {
      type: String,
      trim: true,
      default: '', 
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model('User', userSchema);