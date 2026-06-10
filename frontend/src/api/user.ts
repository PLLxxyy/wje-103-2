import { request } from '@/utils/request';
import type { AuthResult, User } from '@/types/user';
import type { UserRole } from '@/types/enums';

export const userApi = {
  register(data: { nickname: string; phone: string; password: string; role: UserRole }) {
    return request.post<AuthResult>('/auth/register', data);
  },
  login(data: { phone: string; password: string }) {
    return request.post<AuthResult>('/auth/login', data);
  },
  refresh() {
    return request.post<AuthResult>('/auth/refresh');
  },
  me() {
    return request.get<User>('/users/me');
  },
  updateProfile(data: { nickname?: string; avatar?: string }) {
    return request.put<User>('/users/profile', data);
  },
  leaders() {
    return request.get<User[]>('/users/leaders');
  }
};
