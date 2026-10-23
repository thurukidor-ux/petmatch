import { AnimalModel } from '../../models/Animal.js';
import { animalIdParamSchema } from '../../validations/animalValidation.js';

export const animalGetAbl = async ({ params }) => {
  const paramValidation = animalIdParamSchema.safeParse(params);
  if (!paramValidation.success) {
    const error = new Error('Neplatný formát ID zvířete.');
    error.status = 400;
    error.details = paramValidation.error.format();
    throw error;
  }

  const animal = await AnimalModel.findById(params.id);
  if (!animal) {
    const error = new Error('Zvíře s tímto ID nebylo nalezeno.');
    error.status = 404;
    throw error;
  }

  return animal;
};