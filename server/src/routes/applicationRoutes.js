import { Router } from 'express';
import * as applicationController from '../controllers/applicationController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/errorHandler.js';
import { applicationSchema, applicationStatusSchema } from '../validators/schemas.js';

const router = Router();

router.post('/', authenticate, authorize('STUDENT'), validate(applicationSchema), applicationController.apply);
router.get('/my', authenticate, authorize('STUDENT'), applicationController.getMy);
router.get('/', authenticate, authorize('ADMIN'), applicationController.list);
router.get('/:id', authenticate, applicationController.getOne);
router.patch('/:id/status', authenticate, authorize('ADMIN'), validate(applicationStatusSchema), applicationController.updateStatus);
router.patch('/:id/withdraw', authenticate, authorize('STUDENT'), applicationController.withdraw);

export default router;
