import { Router } from 'express';
import { voteController } from '../controllers/vote.controller';
import { authMiddleware } from '../middlewares/auth';
import { roleGuard } from '../middlewares/roleGuard';
import { UserRole } from '../types/enums';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/groupbuy/:groupBuyId', asyncHandler(voteController.list));
router.get('/groupbuy/:groupBuyId/results', asyncHandler(voteController.results));
router.post(
  '/groupbuy/:groupBuyId/options',
  authMiddleware,
  roleGuard([UserRole.LEADER, UserRole.ADMIN]),
  asyncHandler(voteController.createOption)
);
router.post('/:optionId', authMiddleware, asyncHandler(voteController.vote));

export default router;
