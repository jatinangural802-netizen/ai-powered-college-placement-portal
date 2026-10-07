import { Router } from 'express';
import * as resultController from '../controllers/resultController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/errorHandler.js';
import { resultSchema } from '../validators/schemas.js';

const router = Router();

router.get('/my', authenticate, authorize('STUDENT'), resultController.getMy);
router.get('/', authenticate, authorize('ADMIN'), resultController.list);
router.post('/', authenticate, authorize('ADMIN'), validate(resultSchema), resultController.create);
router.put('/:id', authenticate, authorize('ADMIN'), resultController.update);

export default router;
