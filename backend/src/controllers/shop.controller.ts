import type { Request, Response } from 'express';
import { shopService } from '../services/shop.service';
import { success } from '../utils/response';

export const shopController = {
  async list(_req: Request, res: Response) {
    const shops = await shopService.list();
    success(res, shops);
  },

  async detail(req: Request, res: Response) {
    const shop = await shopService.detail(String(req.params.id));
    success(res, shop);
  },

  async dessertItems(req: Request, res: Response) {
    const items = await shopService.dessertItems(String(req.params.id));
    success(res, items);
  }
};
