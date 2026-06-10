import { defineStore } from 'pinia';
import { userApi } from '@/api/user';
import { UserRole } from '@/types/enums';
import type { AuthResult, User } from '@/types/user';
import { storage } from '@/utils/storage';

type UserState = {
  user: User | null;
  token: string | null;
  loading: boolean;
};

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    token: storage.getToken(),
    loading: false
  }),
  getters: {
    isLoggedIn: (state) => Boolean(state.token && state.user),
    isLeader: (state) => state.user?.role === UserRole.LEADER || state.user?.role === UserRole.ADMIN
  },
  actions: {
    setAuth(result: AuthResult) {
      this.user = result.user;
      this.token = result.token;
      storage.setToken(result.token);
    },
    async login(payload: { phone: string; password: string }) {
      this.loading = true;
      try {
        const result = await userApi.login(payload);
        this.setAuth(result);
        return result;
      } finally {
        this.loading = false;
      }
    },
    async register(payload: { nickname: string; phone: string; password: string; role: UserRole }) {
      this.loading = true;
      try {
        const result = await userApi.register(payload);
        this.setAuth(result);
        return result;
      } finally {
        this.loading = false;
      }
    },
    async fetchMe() {
      if (!this.token) return null;
      this.loading = true;
      try {
        this.user = await userApi.me();
        return this.user;
      } finally {
        this.loading = false;
      }
    },
    async refresh() {
      const result = await userApi.refresh();
      this.setAuth(result);
      return result;
    },
    logout() {
      this.user = null;
      this.token = null;
      storage.clearToken();
    }
  }
});
