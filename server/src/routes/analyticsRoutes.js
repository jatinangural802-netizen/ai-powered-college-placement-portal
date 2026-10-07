import { Router } from 'express';
import * as analyticsController from '../controllers/analyticsController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/student', authenticate, authorize('STUDENT'), analyticsController.student);
router.get('/admin', authenticate, authorize('ADMIN'), analyticsController.admin);

export default router;
