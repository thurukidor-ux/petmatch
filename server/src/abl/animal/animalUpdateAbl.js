import { AnimalModel } from '../../models/Animal.js';
import {
  animalIdParamSchema,
  updateAnimalSchema,
} from '../../validations/animalValidation.js';

export const animalUpdateAbl = async ({ params, body }) => {
  const paramValidation = animalIdParamSchema.safeParse(params);
  if (!paramValidation.success) {
    const error = new Error('Neplatný formát ID zvířete.');
    error.status = 400;
    error.details = paramValidation.error.format();
    throw error;
  }

  const bodyValidation = updateAnimalSchema.safeParse(body);
  if (!bodyValidation.success) {
    const error = new Error('Neplatná data pro úpravu.');
    error.status = 400;
    error.details = bodyValidation.error.format();
    throw error;
  }

  const updatedAnimal = await AnimalModel.findByIdAndUpdate(
    params.id,
    { $set: bodyValidation.data },
    { new: true }
  );

  if (!updatedAnimal) {
    const error = new Error('Zvíře nebylo nalezeno.');
    error.status = 404;
    throw error;
  }

  return updatedAnimal;
};