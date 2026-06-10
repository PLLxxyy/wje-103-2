import type { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { AppError, fail } from '../utils/response';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    fail(res, err.code, err.message, err.statusCode);
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const message = err.code === 'P2002' ? '数据已存在，请勿重复提交' : '数据库操作失败';
    fail(res, 400, message, 400);
    return;
  }

  const message = err instanceof Error ? err.message : '服务器内部错误';
  fail(res, 500, message, 500);
};
