import { animalCreateAbl } from '../abl/animal/animalCreateAbl.js';
import { AnimalModel } from '../models/Animal.js';
import {
  updateAnimalSchema,
  animalIdParamSchema,
} from '../validations/animalValidation.js';


export const createAnimal = async (req, res) => {
  try {
    const ownerId = req.user?.id || '654321654321654321654321';
    const animal = await animalCreateAbl({ body: req.body, ownerId });

    return res.status(201).json({
      message: 'Profil zvířete byl úspěšně vytvořen.',
      animal,
    });
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).json({ error: error.message, details: error.details });
    }
    return res.status(500).json({ error: 'Interní chyba serveru.' });
  }
};


export const getAnimalById = async (req, res) => {
  try {
    const paramValidation = animalIdParamSchema.safeParse(req.params);
    if (!paramValidation.success) {
      return res.status(400).json({ error: 'Neplatný formát ID zvířete.' });
    }

    const animal = await AnimalModel.findById(req.params.id);
    if (!animal) {
      return res.status(404).json({ error: 'Zvíře s tímto ID nebylo nalezeno.' });
    }

    return res.json({ animal });
  } catch (error) {
    return res.status(500).json({ error: 'Interní chyba serveru.' });
  }
};


export const updateAnimal = async (req, res) => {
  try {
    const paramValidation = animalIdParamSchema.safeParse(req.params);
    if (!paramValidation.success) {
      return res.status(400).json({ error: 'Neplatný formát ID zvířete.' });
    }

    const bodyValidation = updateAnimalSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        error: 'Neplatná data pro úpravu.',
        details: bodyValidation.error.format(),
      });
    }

    const updatedAnimal = await AnimalModel.findByIdAndUpdate(
      req.params.id,
      { $set: bodyValidation.data },
      { new: true }
    );

    if (!updatedAnimal) {
      return res.status(404).json({ error: 'Zvíře nebylo nalezeno.' });
    }

    return res.json({
      message: 'Profil zvířete byl úspěšně upraven.',
      animal: updatedAnimal,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Interní chyba serveru.' });
  }
};


export const listMyAnimals = async (req, res) => {
  try {
    const ownerId = req.user?.id || '654321654321654321654321';
    const animals = await AnimalModel.find({ ownerId });

    return res.json({ animals });
  } catch (error) {
    return res.status(500).json({ error: 'Interní chyba serveru.' });
  }
};