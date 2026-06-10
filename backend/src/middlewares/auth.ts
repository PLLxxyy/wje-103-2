import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from '../utils/response';
import { UserRole } from '../types/enums';

type JwtPayload = {
  id: string;
  phone: string;
  role: UserRole;
  nickname: string;
};

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next(new AppError('请先登录', 401));
    return;
  }

  try {
    const token = header.replace('Bearer ', '').trim();
    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.user = {
      id: payload.id,
      phone: payload.phone,
      role: payload.role,
      nickname: payload.nickname
    };
    next();
  } catch {
    next(new AppError('登录状态已失效', 401));
  }
};

export const optionalAuthMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next();
    return;
  }

  try {
    const token = header.replace('Bearer ', '').trim();
    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.user = {
      id: payload.id,
      phone: payload.phone,
      role: payload.role,
      nickname: payload.nickname
    };
  } catch {
    req.user = undefined;
  }
  next();
};
