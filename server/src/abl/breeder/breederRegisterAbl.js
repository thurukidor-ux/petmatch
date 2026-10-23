
import pino from 'pino';
import { breederDao } from '../../dao/breederDao.js'; 
import { registerBreederSchema } from '../../validations/breederValidation.js';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
});

export async function breederRegisterAbl({ body }) {
  const validationResult = registerBreederSchema.safeParse(body);
  if (!validationResult.success) {
    const error = new Error('Neplatná data žádosti.');
    error.status = 400;
    error.details = validationResult.error.format();
    throw error;
  }

  const { name, email, kennelName } = validationResult.data;

  
  const existingUser = await breederDao.getByEmail(email);
  if (existingUser) {
    const error = new Error('Uživatel s tímto e-mailem již existuje.');
    error.status = 409;
    throw error;
  }

  
  const newBreeder = await breederDao.create({
    name,
    email,
    kennelName,
    role: 'User',
    isVerified: false,
  });

  logger.info({
    event: 'BREEDER_REGISTRATION_SUBMITTED',
    userId: newBreeder._id,
    email,
    message: 'Nová žádost o ověření chovatele byla zaevidována.',
  });

  return newBreeder;
}