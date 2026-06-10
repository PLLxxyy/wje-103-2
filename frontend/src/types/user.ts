import type { UserRole } from './enums';

export type User = {
  id: string;
  nickname: string;
  phone: string;
  avatar?: string | null;
  role: UserRole;
  created_at: string;
};

export type AuthResult = {
  user: User;
  token: string;
};
