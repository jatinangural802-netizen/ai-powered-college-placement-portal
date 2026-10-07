import { Router } from 'express';
import * as interviewController from '../controllers/interviewController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/errorHandler.js';
import { interviewSchema } from '../validators/schemas.js';

const router = Router();

router.get('/my', authenticate, authorize('STUDENT'), interviewController.getMy);
router.get('/', authenticate, authorize('ADMIN'), interviewController.list);
router.get('/:id', authenticate, interviewController.getOne);
router.post('/', authenticate, authorize('ADMIN'), validate(interviewSchema), interviewController.schedule);
router.put('/:id', authenticate, authorize('ADMIN'), interviewController.update);

export default router;
