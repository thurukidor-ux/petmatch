
import { Router } from 'express';
import {
  registerBreeder,
  getPendingBreeders,
  verifyBreeder,
} from '../controllers/breederController.js';

const router = Router();


router.post('/register', registerBreeder);


router.get('/pending', getPendingBreeders);


router.patch('/:id/verify', verifyBreeder);

export default router;