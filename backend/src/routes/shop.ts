import { Router } from 'express';
import { shopController } from '../controllers/shop.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(shopController.list));
router.get('/:id', asyncHandler(shopController.detail));
router.get('/:id/desserts', asyncHandler(shopController.dessertItems));

export default router;
