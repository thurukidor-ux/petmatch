
import pino from 'pino';
import { documentUploadAbl } from '../abl/document/documentUploadAbl.js';
import { documentGetAbl } from '../abl/document/documentGetAbl.js';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
});

export const uploadDocument = async (req, res) => {
  try {
    const newDocument = await documentUploadAbl({
      file: req.file,
      body: req.body,
      user: req.user,
    });

    return res.status(201).json({
      message: 'Dokument bol úspešne nahraný.',
      document: newDocument,
    });
  } catch (error) {
    logger.error(error, 'Chyba pri nahrávaní dokumentu');
    return res.status(error.status || 500).json({
      error: error.message,
      ...(error.details && { details: error.details }),
    });
  }
};

export const getDocument = async (req, res) => {
  try {
    const { filePath } = await documentGetAbl({
      params: req.params,
    });

    return res.sendFile(filePath);
  } catch (error) {
    logger.error(error, 'Chyba pri sťahovaní dokumentu');
    return res.status(error.status || 500).json({
      error: error.message,
    });
  }
};