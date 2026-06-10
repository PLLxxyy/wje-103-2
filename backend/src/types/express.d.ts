import type { UserRole } from './enums';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        phone: string;
        role: UserRole;
        nickname: string;
      };
    }
  }
}

export {};
