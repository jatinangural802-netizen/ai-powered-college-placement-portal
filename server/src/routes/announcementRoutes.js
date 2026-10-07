import { Router } from 'express';
import * as announcementController from '../controllers/announcementController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/errorHandler.js';
import { announcementSchema } from '../validators/schemas.js';

const router = Router();

router.get('/', authenticate, announcementController.list);
router.post('/', authenticate, authorize('ADMIN'), validate(announcementSchema), announcementController.create);
router.put('/:id', authenticate, authorize('ADMIN'), announcementController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), announcementController.remove);

export default router;
