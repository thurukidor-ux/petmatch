
import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;


export const registerBreederSchema = z.object({
  name: z.string().min(2, 'Jméno musí mít alespoň 2 znaky.'),
  email: z.string().email('Neplatný formát e-mailu.'),
  kennelName: z.string().min(2, 'Název chovatelské stanice je povinný.'),
});


export const verifyBreederSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED'], {
    errorMap: () => ({ message: 'Status musí být buď APPROVED nebo REJECTED.' }),
  }),
});

export const userIdParamSchema = z.object({
  id: z.string().regex(objectIdRegex, 'Neplatný formát ID uživatele.'),
});