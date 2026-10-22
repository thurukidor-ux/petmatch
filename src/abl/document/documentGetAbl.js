
import path from 'path';
import fs from 'fs';
import { documentDao } from '../../dao/documentDao.js'; 
import { documentIdParamSchema } from '../../validations/documentValidation.js';

export async function documentGetAbl({ params }) {
  const paramValidation = documentIdParamSchema.safeParse(params);
  if (!paramValidation.success) {
    const error = new Error('Neplatný formát ID dokumentu.');
    error.status = 400;
    throw error;
  }

  
  const document = await documentDao.getById(params.id);
  if (!document) {
    const error = new Error('Dokument nebyl nalezen.');
    error.status = 404;
    throw error;
  }

  const resolvedPath = path.resolve(document.storagePath);
  if (!fs.existsSync(resolvedPath)) {
    const error = new Error('Fyzický soubor na disku neexistuje.');
    error.status = 404;
    throw error;
  }

  return {
    filePath: resolvedPath,
    mimeType: document.mimeType,
    originalFilename: document.originalFilename,
  };
}