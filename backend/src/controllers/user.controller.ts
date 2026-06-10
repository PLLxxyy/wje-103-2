import type { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { success } from '../utils/response';

export const userController = {
  async me(req: Request, res: Response) {
    const user = await userService.getById(req.user!.id);
    success(res, user);
  },

  async updateProfile(req: Request, res: Response) {
    const user = await userService.updateProfile(req.user!.id, req.body);
    success(res, user, '资料已更新');
  },

  async leaders(_req: Request, res: Response) {
    const leaders = await userService.listLeaders();
    success(res, leaders);
  }
};
