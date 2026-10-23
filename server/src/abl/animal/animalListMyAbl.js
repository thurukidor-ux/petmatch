import { AnimalModel } from '../../models/Animal.js';

export const animalListMyAbl = async ({ ownerId }) => {
  return await AnimalModel.find({ ownerId });
};