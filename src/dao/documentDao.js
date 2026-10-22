
import { DocumentModel } from '../models/Document.js';

export const documentDao = {
  
  async create(data) {
    return await DocumentModel.create(data);
  },


  async getById(id) {
    return await DocumentModel.findById(id);
  },

 
  async listByAnimal(animalId) {
    return await DocumentModel.find({ animalId });
  },
};