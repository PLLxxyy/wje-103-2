import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { userService, signToken } from '../services/user.service';
import { asyncHandler } from '../utils/asyncHandler';
import { created, success } from '../utils/response';

const router = Router();

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const data = await userService.register(req.body);
    created(res, data, '注册成功');
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const data = await userService.login(req.body);
    success(res, data, '登录成功');
  })
);

router.post(
  '/refresh',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const user = await userService.getById(req.user!.id);
    success(res, { user, token: signToken(user) }, '刷新成功');
  })
);

export default router;
