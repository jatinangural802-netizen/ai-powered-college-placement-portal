import { Router } from 'express';
import * as driveController from '../controllers/driveController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/errorHandler.js';
import { driveSchema } from '../validators/schemas.js';

const router = Router();

router.get('/', authenticate, driveController.list);
router.get('/:id', authenticate, driveController.getOne);
router.post('/', authenticate, authorize('ADMIN'), validate(driveSchema), driveController.create);
router.put('/:id', authenticate, authorize('ADMIN'), driveController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), driveController.remove);

export default router;
