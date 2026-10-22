
import { Router } from 'express';
import {
  createAnimal,
  getAnimalById,
  updateAnimal,
  listMyAnimals,
} from '../controllers/animalController.js';

const router = Router();


router.post('/', createAnimal);


router.get('/', listMyAnimals);


router.get('/:id', getAnimalById);


router.put('/:id', updateAnimal);

export default router;