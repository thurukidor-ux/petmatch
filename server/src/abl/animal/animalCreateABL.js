
import pino from 'pino';
import { animalDao } from '../../dao/animalDao.js'; 
import { createAnimalSchema } from '../../validations/animalValidation.js';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
});

export async function animalCreateAbl({ body, ownerId }) {
  
  const validationResult = createAnimalSchema.safeParse(body);
  if (!validationResult.success) {
    const error = new Error('Neplatná data pro vytvoření zvířete.');
    error.status = 400;
    error.details = validationResult.error.format();
    throw error;
  }

  
  const newAnimal = await animalDao.create({
    ...validationResult.data,
    ownerId,
  });

  
  logger.info({
    event: 'ANIMAL_CREATED',
    animalId: newAnimal._id,
    ownerId,
    animalName: newAnimal.name,
    message: 'Byl úspěšně založen nový profil zvířete.',
  });

  return newAnimal;
}