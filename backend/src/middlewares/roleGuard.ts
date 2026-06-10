import type { NextFunction, Request, Response } from 'express';
import type { UserRole } from '../types/enums';
import { AppError } from '../utils/response';

export const roleGuard = (roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new AppError('请先登录', 401));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new AppError('没有访问权限', 403));
      return;
    }

    next();
  };
};
