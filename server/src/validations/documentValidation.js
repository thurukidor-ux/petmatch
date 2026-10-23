import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const uploadDocumentSchema = z.object({
  animalId: z
    .string({ required_error: "Identifikátor zvířete (animalId) je povinný." })
    .regex(
      objectIdRegex,
      "Neplatný formát animalId (musí být Mongo ObjectId).",
    ),

  documentType: z.enum(["PEDIGREE", "VET_REPORT", "BREEDING_LICENSE"], {
    errorMap: () => ({
      message:
        "Povolené typy dokladů jsou: PEDIGREE, VET_REPORT, BREEDING_LICENSE.",
    }),
  }),
});

export const documentIdParamSchema = z.object({
  id: z
    .string({ required_error: "ID dokumentu je povinné." })
    .regex(objectIdRegex, "Neplatný formát ID dokumentu."),
});
