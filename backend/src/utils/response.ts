import type { Response } from 'express';

export class AppError extends Error {
  statusCode: number;
  code: number;

  constructor(message: string, statusCode = 400, code = statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const success = <T>(res: Response, data: T, message = 'ok') => {
  return res.json({ code: 0, data, message });
};

export const created = <T>(res: Response, data: T, message = 'created') => {
  return res.status(201).json({ code: 0, data, message });
};

export const fail = (res: Response, code: number, message: string, statusCode = 400) => {
  return res.status(statusCode).json({ code, data: null, message });
};
