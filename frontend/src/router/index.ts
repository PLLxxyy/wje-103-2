import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/enums';
import type { RoutePermission } from '@/types/permissions';

declare module 'vue-router' {
  interface RouteMeta extends RoutePermission {}
}

const routes: RouteRecordRaw[] = [
  { path: '/login', name: 'login', component: () => import('@/pages/Login.vue') },
  { path: '/', name: 'home', component: () => import('@/pages/Home.vue') },
  {
    path: '/groupbuy/create',
    name: 'groupbuy-create',
    component: () => import('@/pages/GroupBuyCreate.vue'),
    meta: { requiresAuth: true, roles: [UserRole.LEADER, UserRole.ADMIN] }
  },
  {
    path: '/groupbuy/:id',
    name: 'groupbuy-detail',
    component: () => import('@/pages/GroupBuyDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/order/manage',
    name: 'order-manage',
    component: () => import('@/pages/OrderManage.vue'),
    meta: { requiresAuth: true, roles: [UserRole.LEADER, UserRole.ADMIN] }
  },
  { path: '/shops', name: 'shops', component: () => import('@/pages/Shops.vue') },
  {
    path: '/my/joins',
    name: 'my-joins',
    component: () => import('@/pages/MyJoins.vue'),
    meta: { requiresAuth: true }
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
});

router.beforeEach(async (to) => {
  const auth = useAuth();

  if (auth.token.value && !auth.currentUser.value) {
    try {
      await auth.fetchMe();
    } catch {
      auth.logout();
    }
  }

  if (to.meta.requiresAuth && !auth.currentUser.value) {
    return { path: '/login', query: { redirect: to.fullPath } };
  }

  if (to.meta.roles?.length && !auth.hasRole(to.meta.roles)) {
    return { path: '/' };
  }

  return true;
});
