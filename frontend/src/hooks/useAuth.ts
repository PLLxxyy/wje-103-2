import { computed } from 'vue';
import { useUserStore } from '@/stores/useUserStore';
import type { UserRole } from '@/types/enums';

export const useAuth = () => {
  const userStore = useUserStore();

  const currentUser = computed(() => userStore.user);
  const token = computed(() => userStore.token);
  const isLoggedIn = computed(() => Boolean(userStore.token && userStore.user));

  const hasRole = (roles: UserRole[]) => {
    if (!userStore.user) return false;
    return roles.includes(userStore.user.role);
  };

  const logout = () => {
    userStore.logout();
  };

  return {
    currentUser,
    token,
    isLoggedIn,
    hasRole,
    login: userStore.login,
    register: userStore.register,
    fetchMe: userStore.fetchMe,
    logout
  };
};
