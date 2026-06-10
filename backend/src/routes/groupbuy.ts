import { Router } from 'express';
import { groupBuyController } from '../controllers/groupbuy.controller';
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/auth';
import { roleGuard } from '../middlewares/roleGuard';
import { UserRole } from '../types/enums';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', optionalAuthMiddleware, asyncHandler(groupBuyController.list));
router.get('/:id', asyncHandler(groupBuyController.detail));
router.post(
  '/',
  authMiddleware,
  roleGuard([UserRole.LEADER, UserRole.ADMIN]),
  asyncHandler(groupBuyController.create)
);
router.patch(
  '/:id/status',
  authMiddleware,
  roleGuard([UserRole.LEADER, UserRole.ADMIN]),
  asyncHandler(groupBuyController.updateStatus)
);

export default router;
