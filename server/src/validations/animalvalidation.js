
import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;


export const createAnimalSchema = z.object({
  name: z.string().min(1, 'Jméno zvířete je povinné.').max(50),
  species: z.enum(['DOG', 'CAT'], {
    errorMap: () => ({ message: 'Druh musí být DOG nebo CAT.' }),
  }),
  breed: z.string().min(1, 'Plemeno je povinné.').max(50),
  gender: z.enum(['MALE', 'FEMALE'], {
    errorMap: () => ({ message: 'Pohlaví musí být MALE nebo FEMALE.' }),
  }),
  birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Neplatný formát data narození (použijte YYYY-MM-DD).',
  }),
  description: z.string().max(500).optional(),
  healthStatus: z.string().max(200).optional(),
});


export const updateAnimalSchema = createAnimalSchema.partial();


export const animalIdParamSchema = z.object({
  id: z.string().regex(objectIdRegex, 'Neplatný formát ID zvířete.'),
});