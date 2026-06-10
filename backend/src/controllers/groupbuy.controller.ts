import type { Request, Response } from 'express';
import { groupBuyService } from '../services/groupbuy.service';
import { GroupBuyStatus } from '../types/enums';
import { created, success } from '../utils/response';

export const groupBuyController = {
  async list(req: Request, res: Response) {
    const groupBuys = await groupBuyService.list({
      status: req.query.status as GroupBuyStatus | undefined,
      shopId: req.query.shopId as string | undefined,
      leaderId: req.query.mine === '1' ? req.user?.id : (req.query.leaderId as string | undefined)
    });
    success(res, groupBuys);
  },

  async detail(req: Request, res: Response) {
    const groupBuy = await groupBuyService.detail(String(req.params.id));
    success(res, groupBuy);
  },

  async create(req: Request, res: Response) {
    const groupBuy = await groupBuyService.create(req.body, req.user!.id);
    created(res, groupBuy, '团购已创建');
  },

  async updateStatus(req: Request, res: Response) {
    const groupBuy = await groupBuyService.updateStatus(String(req.params.id), req.body.status, {
      id: req.user!.id,
      role: req.user!.role
    });
    success(res, groupBuy, '团购状态已更新');
  }
};
