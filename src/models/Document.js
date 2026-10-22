import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    animalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Animal",
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    documentType: {
      type: String,
      enum: ["PEDIGREE", "VET_REPORT", "BREEDING_LICENSE"],
      required: true,
    },

    originalFilename: {
      type: String,
      required: true,
      trim: true,
    },

    storagePath: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    sizeBytes: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  },
);

export const DocumentModel = mongoose.model("Document", documentSchema);
