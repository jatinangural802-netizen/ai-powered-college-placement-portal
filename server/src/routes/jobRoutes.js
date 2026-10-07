import { Router } from 'express';
import * as jobController from '../controllers/jobController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/errorHandler.js';
import { jobSchema } from '../validators/schemas.js';

const router = Router();

router.get('/', authenticate, jobController.list);
router.get('/recommended', authenticate, authorize('STUDENT'), jobController.recommended);
router.get('/:id', authenticate, jobController.getOne);
router.post('/', authenticate, authorize('ADMIN'), validate(jobSchema), jobController.create);
router.put('/:id', authenticate, authorize('ADMIN'), validate(jobSchema), jobController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), jobController.remove);

export default router;
