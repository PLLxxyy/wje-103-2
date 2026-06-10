import type { Request, Response } from 'express';
import { joinService } from '../services/join.service';
import { created, success } from '../utils/response';

export const joinController = {
  async create(req: Request, res: Response) {
    const record = await joinService.create(req.body, req.user!.id);
    created(res, record, '接龙成功');
  },

  async myJoins(req: Request, res: Response) {
    const records = await joinService.myJoins(req.user!.id);
    success(res, records);
  },

  async manage(req: Request, res: Response) {
    const data = await joinService.manage(
      { id: req.user!.id, role: req.user!.role },
      req.query.groupBuyId as string | undefined
    );
    success(res, data);
  },

  async markPicked(req: Request, res: Response) {
    const record = await joinService.markPicked(String(req.params.id), Boolean(req.body.picked_up), {
      id: req.user!.id,
      role: req.user!.role
    });
    success(res, record, '提货状态已更新');
  }
};
