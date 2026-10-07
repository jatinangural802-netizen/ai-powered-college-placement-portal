import { Router } from 'express';
import * as analysisController from '../controllers/resumeAnalysisController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/errorHandler.js';
import { analyzeSchema } from '../validators/schemas.js';

const router = Router();

router.get('/ai-status', authenticate, analysisController.aiStatus);
router.post('/analyze', authenticate, authorize('STUDENT'), validate(analyzeSchema), analysisController.analyze);
router.post('/job-match', authenticate, authorize('STUDENT'), validate(analyzeSchema), analysisController.jobMatch);
router.get('/history', authenticate, authorize('STUDENT'), analysisController.history);
router.get('/history/:resumeId', authenticate, authorize('STUDENT'), analysisController.history);
router.get('/:id', authenticate, authorize('STUDENT'), analysisController.getOne);

export default router;
