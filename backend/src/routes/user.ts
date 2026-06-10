import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/me', authMiddleware, asyncHandler(userController.me));
router.put('/profile', authMiddleware, asyncHandler(userController.updateProfile));
router.get('/leaders', authMiddleware, asyncHandler(userController.leaders));

export default router;
