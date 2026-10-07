import { Router } from 'express';
import * as studentController from '../controllers/studentController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/errorHandler.js';
import { profileUpdateSchema } from '../validators/schemas.js';

const router = Router();

router.get('/profile', authenticate, authorize('STUDENT'), studentController.getProfile);
router.put('/profile', authenticate, authorize('STUDENT'), validate(profileUpdateSchema), studentController.updateProfile);
router.get('/dashboard', authenticate, authorize('STUDENT'), studentController.getDashboard);
router.get('/', authenticate, authorize('ADMIN'), studentController.listStudents);
router.get('/:id', authenticate, authorize('ADMIN'), studentController.getStudent);

export default router;
