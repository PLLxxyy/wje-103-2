<script setup lang="ts">
import { computed, onMounted } from 'vue';
import GroupBuyCard from '@/components/common/GroupBuyCard.vue';
import PickupPointTag from '@/components/common/PickupPointTag.vue';
import { useAuth } from '@/hooks/useAuth';
import { useJoinStore } from '@/stores/useJoinStore';
import { formatDateTime } from '@/utils/format';

const auth = useAuth();
const joinStore = useJoinStore();

const totalQuantity = computed(() =>
  joinStore.myJoins.reduce((sum, record) => sum + Number(record.quantity), 0)
);
const pendingPickup = computed(() => joinStore.myJoins.filter((record) => !record.picked_up).length);

onMounted(() => {
  joinStore.fetchMyJoins();
});
</script>

<template>
  <main class="page my-page">
    <section class="profile-band">
      <img :src="auth.currentUser.value?.avatar || ''" :alt="auth.currentUser.value?.nickname" />
      <div>
        <h1>{{ auth.currentUser.value?.nickname }}</h1>
        <p>{{ auth.currentUser.value?.phone }} · {{ auth.currentUser.value?.role }}</p>
      </div>
    </section>

    <section class="section summary-grid">
      <div class="panel">
        <span>接龙</span>
        <strong>{{ joinStore.myJoins.length }}</strong>
      </div>
      <div class="panel">
        <span>份数</span>
        <strong>{{ totalQuantity }}</strong>
      </div>
      <div class="panel">
        <span>待提</span>
        <strong>{{ pendingPickup }}</strong>
      </div>
    </section>

    <section class="section stack">
      <article v-for="record in joinStore.myJoins" :key="record.id" class="join-card">
        <GroupBuyCard v-if="record.groupBuy" :group-buy="record.groupBuy" compact />
        <div class="join-meta">
          <div>
            <strong>{{ record.flavor }} × {{ record.quantity }}</strong>
            <span>{{ formatDateTime(record.joined_at) }}</span>
          </div>
          <van-tag :type="record.picked_up ? 'success' : 'warning'" round>
            {{ record.picked_up ? '已提货' : '待提货' }}
          </van-tag>
        </div>
        <PickupPointTag v-if="record.pickupPoint" :point="record.pickupPoint" />
      </article>
      <van-empty v-if="!joinStore.loading && joinStore.myJoins.length === 0" description="暂无接龙记录" />
    </section>
  </main>
</template>

<style scoped>
.profile-band {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  color: #fff8f2;
  background:
    linear-gradient(120deg, rgba(46, 29, 22, 0.72), rgba(46, 29, 22, 0.28)),
    url("https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=900&q=80") center/cover;
}

.profile-band img {
  width: 72px;
  height: 72px;
  border: 2px solid rgba(255, 248, 242, 0.78);
  border-radius: 50%;
  object-fit: cover;
}

.profile-band h1 {
  margin: 0 0 6px;
  font-size: 24px;
  letter-spacing: 0;
}

.profile-band p {
  margin: 0;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.summary-grid .panel {
  display: grid;
  gap: 4px;
}

.summary-grid span {
  color: #826d60;
  font-size: 12px;
}

.summary-grid strong {
  color: #d94f5d;
  font-size: 24px;
}

.join-card {
  display: grid;
  gap: 10px;
  padding: 10px;
  border: 1px solid #ead8c7;
  border-radius: 8px;
  background: #fffaf4;
}

.join-meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.join-meta div {
  display: grid;
  gap: 4px;
}

.join-meta span {
  color: #826d60;
  font-size: 12px;
}
</style>
