import { Router } from 'express';
import { joinController } from '../controllers/join.controller';
import { authMiddleware } from '../middlewares/auth';
import { roleGuard } from '../middlewares/roleGuard';
import { UserRole } from '../types/enums';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/', authMiddleware, asyncHandler(joinController.create));
router.get('/my', authMiddleware, asyncHandler(joinController.myJoins));
router.get(
  '/manage',
  authMiddleware,
  roleGuard([UserRole.LEADER, UserRole.ADMIN]),
  asyncHandler(joinController.manage)
);
router.patch(
  '/:id/picked',
  authMiddleware,
  roleGuard([UserRole.LEADER, UserRole.ADMIN]),
  asyncHandler(joinController.markPicked)
);

export default router;
