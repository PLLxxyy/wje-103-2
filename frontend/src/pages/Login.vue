<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showSuccessToast } from 'vant';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/enums';

const route = useRoute();
const router = useRouter();
const auth = useAuth();
const mode = ref<'login' | 'register'>('login');
const form = reactive({
  nickname: '甜品新朋友',
  phone: '13800000001',
  password: '123456',
  role: UserRole.MEMBER
});

const submit = async () => {
  if (mode.value === 'login') {
    await auth.login({ phone: form.phone, password: form.password });
    showSuccessToast('登录成功');
  } else {
    await auth.register({
      nickname: form.nickname,
      phone: form.phone,
      password: form.password,
      role: form.role
    });
    showSuccessToast('注册成功');
  }
  router.replace((route.query.redirect as string) || '/');
};
</script>

<template>
  <main class="login-page">
    <section class="login-hero">
      <span>社区甜品接龙</span>
      <h1>好吃的甜品，凑齐一团再下单。</h1>
    </section>

    <form class="panel login-form" @submit.prevent="submit">
      <van-tabs v-model:active="mode" shrink>
        <van-tab title="登录" name="login" />
        <van-tab title="注册" name="register" />
      </van-tabs>

      <van-field
        v-if="mode === 'register'"
        v-model="form.nickname"
        label="昵称"
      />
      <van-field v-model="form.phone" label="手机号" type="tel" />
      <van-field v-model="form.password" label="密码" type="password" />

      <div v-if="mode === 'register'" class="role-row">
        <button
          type="button"
          :class="{ active: form.role === UserRole.MEMBER }"
          @click="form.role = UserRole.MEMBER"
        >
          团员
        </button>
        <button
          type="button"
          :class="{ active: form.role === UserRole.LEADER }"
          @click="form.role = UserRole.LEADER"
        >
          团长
        </button>
      </div>

      <van-button block type="primary" native-type="submit">
        {{ mode === 'login' ? '登录' : '创建账号' }}
      </van-button>

      <div class="quick-accounts">
        <button type="button" @click="form.phone = '13800000001'; form.password = '123456'">团长账号</button>
        <button type="button" @click="form.phone = '13800000002'; form.password = '123456'">团员账号</button>
      </div>
    </form>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  padding: 26px 16px;
  background:
    linear-gradient(180deg, rgba(255, 244, 237, 0.25), rgba(237, 244, 232, 0.88)),
    url("https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80") center/cover;
}

.login-hero {
  display: grid;
  gap: 12px;
  min-height: 35vh;
  align-content: end;
  padding-bottom: 20px;
  color: #fff8f2;
  text-shadow: 0 2px 14px rgba(44, 25, 18, 0.45);
}

.login-hero span {
  width: fit-content;
  padding: 6px 10px;
  border-radius: 8px;
  background: rgba(48, 31, 24, 0.42);
  font-size: 13px;
}

.login-hero h1 {
  max-width: 9em;
  margin: 0;
  font-size: 34px;
  line-height: 1.1;
  letter-spacing: 0;
}

.login-form {
  display: grid;
  gap: 14px;
}

.role-row,
.quick-accounts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.role-row button,
.quick-accounts button {
  min-height: 40px;
  border: 1px solid #ead8c7;
  border-radius: 8px;
  color: #62483b;
  background: #fffaf4;
}

.role-row button.active {
  border-color: #e35d6a;
  color: #b53242;
  background: #fff1f2;
  font-weight: 700;
}
</style>
