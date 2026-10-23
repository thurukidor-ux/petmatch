
import pino from 'pino';
import { animalCreateAbl } from '../abl/animal/animalCreateAbl.js';
import { animalGetAbl } from '../abl/animal/animalGetAbl.js';
import { animalUpdateAbl } from '../abl/animal/animalUpdateAbl.js';
import { animalListMyAbl } from '../abl/animal/animalListMyAbl.js';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
});

export const createAnimal = async (req, res) => {
  try {
    const ownerId = req.user?.id || '654321654321654321654321';
    const animal = await animalCreateAbl({ body: req.body, ownerId });

    return res.status(201).json({
      message: 'Profil zvířete byl úspěšně vytvořen.',
      animal,
    });
  } catch (error) {
    logger.error(error, 'Chyba při vytváření zvířete');
    return res.status(error.status || 500).json({
      error: error.message,
      ...(error.details && { details: error.details }),
    });
  }
};

export const getAnimalById = async (req, res) => {
  try {
    const animal = await animalGetAbl({ params: req.params });

    return res.json({ animal });
  } catch (error) {
    logger.error(error, 'Chyba při načítání zvířete');
    return res.status(error.status || 500).json({
      error: error.message,
      ...(error.details && { details: error.details }),
    });
  }
};

export const updateAnimal = async (req, res) => {
  try {
    const updatedAnimal = await animalUpdateAbl({
      params: req.params,
      body: req.body,
    });

    return res.json({
      message: 'Profil zvířete byl úspěšně upraven.',
      animal: updatedAnimal,
    });
  } catch (error) {
    logger.error(error, 'Chyba při úpravě zvířete');
    return res.status(error.status || 500).json({
      error: error.message,
      ...(error.details && { details: error.details }),
    });
  }
};

export const listMyAnimals = async (req, res) => {
  try {
    const ownerId = req.user?.id || '654321654321654321654321';
    const animals = await animalListMyAbl({ ownerId });

    return res.json({ animals });
  } catch (error) {
    logger.error(error, 'Chyba při načítání seznamu zvířat');
    return res.status(error.status || 500).json({
      error: error.message,
    });
  }
};