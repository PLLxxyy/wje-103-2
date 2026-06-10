import type { App, DirectiveBinding } from 'vue';
import { useUserStore } from '@/stores/useUserStore';
import type { UserRole } from '@/types/enums';

const applyPermission = (el: HTMLElement, binding: DirectiveBinding<UserRole[]>) => {
  const userStore = useUserStore();
  const roles = binding.value ?? [];
  const visible = Boolean(userStore.user && roles.includes(userStore.user.role));
  el.style.display = visible ? '' : 'none';
};

export const permissionDirective = {
  install(app: App) {
    app.directive('permission', {
      mounted: applyPermission,
      updated: applyPermission
    });
  }
};
