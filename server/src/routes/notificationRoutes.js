import { Router } from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, notificationController.getMy);
router.patch('/read-all', authenticate, notificationController.markAllRead);
router.patch('/:id/read', authenticate, notificationController.markRead);

export default router;
