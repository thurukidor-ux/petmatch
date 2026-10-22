
import pino from 'pino';
import { breederDao } from '../../dao/breederDao.js'; 
import {
  verifyBreederSchema,
  userIdParamSchema,
} from '../../validations/breederValidation.js';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
});

export async function breederVerifyAbl({ params, body }) {
  const paramValidation = userIdParamSchema.safeParse(params);
  if (!paramValidation.success) {
    const error = new Error('Neplatné ID uživatele.');
    error.status = 400;
    throw error;
  }

  const bodyValidation = verifyBreederSchema.safeParse(body);
  if (!bodyValidation.success) {
    const error = new Error('Neplatné tělo požadavku.');
    error.status = 400;
    error.details = bodyValidation.error.format();
    throw error;
  }

  const { status } = bodyValidation.data;
  const isApproved = status === 'APPROVED';

  
  const updatedUser = await breederDao.updateVerification(params.id, {
    isVerified: isApproved,
    role: isApproved ? 'Breeder' : 'User',
  });

  if (!updatedUser) {
    const error = new Error('Chovatel nebyl nalezen.');
    error.status = 404;
    throw error;
  }

  logger.info({
    event: 'BREEDER_VERIFICATION_DECIDED',
    adminUser: 'Admin_Eva',
    targetUserId: updatedUser._id,
    decision: status,
    assignedRole: updatedUser.role,
    message: `Chovatel byl administrátorem ${isApproved ? 'schválen s rolí Breeder' : 'zamítnut'}.`,
  });

  return {
    status,
    isApproved,
    user: updatedUser,
  };
}