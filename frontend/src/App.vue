<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/enums';

const route = useRoute();
const router = useRouter();
const auth = useAuth();

const activeTab = computed(() => {
  if (route.path.startsWith('/shops')) return '/shops';
  if (route.path.startsWith('/my/joins')) return '/my/joins';
  if (route.path.startsWith('/order/manage')) return '/order/manage';
  return '/';
});

const logout = () => {
  auth.logout();
  router.replace('/login');
};
</script>

<template>
  <div class="mobile-shell">
    <header v-if="route.path !== '/login'" class="topbar">
      <button class="brand" type="button" @click="router.push('/')">
        <span>甜品团购社区</span>
        <small>{{ auth.currentUser.value?.nickname || '游客' }}</small>
      </button>
      <div class="top-actions">
        <van-button
          v-permission="[UserRole.LEADER, UserRole.ADMIN]"
          size="small"
          icon="plus"
          type="primary"
          @click="router.push('/groupbuy/create')"
        />
        <van-button v-if="auth.currentUser.value" size="small" icon="cross" plain @click="logout" />
        <van-button v-else size="small" icon="user-o" plain @click="router.push('/login')" />
      </div>
    </header>

    <RouterView />

    <van-tabbar v-if="route.path !== '/login'" :model-value="activeTab" route safe-area-inset-bottom>
      <van-tabbar-item to="/" icon="fire-o">团购</van-tabbar-item>
      <van-tabbar-item to="/shops" icon="shop-o">店铺</van-tabbar-item>
      <van-tabbar-item to="/my/joins" icon="orders-o">接龙</van-tabbar-item>
      <van-tabbar-item
        v-permission="[UserRole.LEADER, UserRole.ADMIN]"
        to="/order/manage"
        icon="records-o"
      >
        管理
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(234, 216, 199, 0.75);
  background: rgba(255, 248, 241, 0.94);
  backdrop-filter: blur(14px);
}

.brand {
  display: grid;
  gap: 2px;
  padding: 0;
  border: 0;
  color: #33221b;
  text-align: left;
  background: transparent;
}

.brand span {
  font-size: 17px;
  font-weight: 800;
}

.brand small {
  color: #826d60;
  font-size: 12px;
}

.top-actions {
  display: flex;
  gap: 8px;
}
</style>
