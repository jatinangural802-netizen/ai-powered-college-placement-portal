import { Router } from 'express';
import * as resumeController from '../controllers/resumeController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadResume, handleMulterError } from '../middleware/upload.js';

const router = Router();

router.post('/upload', authenticate, authorize('STUDENT'), uploadResume.single('resume'), handleMulterError, resumeController.upload);
router.get('/my', authenticate, authorize('STUDENT'), resumeController.getMy);
router.get('/:id', authenticate, resumeController.getOne);

export default router;
