import type { Request, Response } from 'express';
import { voteService } from '../services/vote.service';
import { created, success } from '../utils/response';

export const voteController = {
  async list(req: Request, res: Response) {
    const options = await voteService.list(String(req.params.groupBuyId));
    success(res, options);
  },

  async createOption(req: Request, res: Response) {
    const option = await voteService.createOption(String(req.params.groupBuyId), req.body.option_text, {
      id: req.user!.id,
      role: req.user!.role
    });
    created(res, option, '投票选项已添加');
  },

  async vote(req: Request, res: Response) {
    const record = await voteService.vote(String(req.params.optionId), req.user!.id);
    created(res, record, '投票成功');
  },

  async results(req: Request, res: Response) {
    const data = await voteService.results(String(req.params.groupBuyId));
    success(res, data);
  }
};
