import { Router } from 'express';
import * as companyController from '../controllers/companyController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/errorHandler.js';
import { companySchema } from '../validators/schemas.js';

const router = Router();

router.get('/', authenticate, companyController.list);
router.get('/:id', authenticate, companyController.getOne);
router.post('/', authenticate, authorize('ADMIN'), validate(companySchema), companyController.create);
router.put('/:id', authenticate, authorize('ADMIN'), validate(companySchema), companyController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), companyController.remove);

export default router;
