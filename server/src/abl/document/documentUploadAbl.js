
import fs from 'fs';
import pino from 'pino';
import { documentDao } from '../../dao/documentDao.js'; 
import { uploadDocumentSchema } from '../../validations/documentValidation.js';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
});

export async function documentUploadAbl({ file, body, user }) {
  if (!file) {
    const error = new Error('Nebyl přiložen žádný soubor k nahrání.');
    error.status = 400;
    throw error;
  }

  const validationResult = uploadDocumentSchema.safeParse(body);
  if (!validationResult.success) {
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    const error = new Error('Neplatná vstupní data.');
    error.status = 400;
    error.details = validationResult.error.format();
    throw error;
  }

  const { animalId, documentType } = validationResult.data;
  const uploadedBy = user?.id || '654321654321654321654321';

  
  const newDocument = await documentDao.create({
    animalId,
    uploadedBy,
    documentType,
    originalFilename: file.originalname,
    storagePath: file.path,
    mimeType: file.mimetype,
    sizeBytes: file.size,
    status: 'PENDING',
  });

  logger.info({
    event: 'DOCUMENT_UPLOADED',
    documentId: newDocument._id,
    animalId,
    uploadedBy,
    filename: file.originalname,
    message: 'Nový doklad ke zvířeti byl úspěšně nahrán.',
  });

  return newDocument;
}