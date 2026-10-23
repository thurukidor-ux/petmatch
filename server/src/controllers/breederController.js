// src/controllers/breederController.js
import pino from 'pino';
import { breederRegisterAbl } from '../abl/breeder/breederRegisterAbl.js';
import { breederListPendingAbl } from '../abl/breeder/breederListPendingAbl.js';
import { breederVerifyAbl } from '../abl/breeder/breederVerifyAbl.js';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
});

export const registerBreeder = async (req, res) => {
  try {
    const newBreeder = await breederRegisterAbl({ body: req.body });
    return res.status(201).json({
      message: 'Žiadosť o overenie chovateľa bola odoslaná administrátorovi.',
      user: newBreeder,
    });
  } catch (error) {
    logger.error(error, 'Chyba pri registrácii chovateľa');
    return res.status(error.status || 500).json({
      error: error.message,
      ...(error.details && { details: error.details }),
    });
  }
};

export const getPendingBreeders = async (req, res) => {
  try {
    const pendingBreeders = await breederListPendingAbl();
    return res.json({ pendingBreeders });
  } catch (error) {
    logger.error(error, 'Chyba pri načítaní žiadostí');
    return res.status(error.status || 500).json({
      error: error.message,
    });
  }
};

export const verifyBreeder = async (req, res) => {
  try {
    const { isApproved, user } = await breederVerifyAbl({
      params: req.params,
      body: req.body,
    });

    return res.json({
      message: `Žiadosť chovateľa bola ${isApproved ? 'schválená' : 'zamietnutá'}.`,
      user,
    });
  } catch (error) {
    logger.error(error, 'Chyba pri overovaní chovateľa');
    return res.status(error.status || 500).json({
      error: error.message,
      ...(error.details && { details: error.details }),
    });
  }
};