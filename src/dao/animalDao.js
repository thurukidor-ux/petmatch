
import { AnimalModel } from '../models/Animal.js';

export const animalDao = {

  async create(data) {
    return await AnimalModel.create(data);
  },


  async getById(id) {
    return await AnimalModel.findById(id);
  },

 
  async update(id, updateData) {
    return await AnimalModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
  },

  
  async listByOwner(ownerId) {
    return await AnimalModel.find({ ownerId });
  },
};