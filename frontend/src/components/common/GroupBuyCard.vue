<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import type { GroupBuy } from '@/types/groupbuy';
import { formatPrice } from '@/utils/format';
import CountdownTimer from './CountdownTimer.vue';
import StatusBadge from './StatusBadge.vue';

const props = defineProps<{
  groupBuy: GroupBuy;
  compact?: boolean;
}>();

const joinedQuantity = computed(() =>
  (props.groupBuy.joinRecords ?? []).reduce((sum, record) => sum + Number(record.quantity), 0)
);
const progress = computed(() => Math.min(100, Math.round((joinedQuantity.value / props.groupBuy.min_quantity) * 100)));
const cover = computed(() => props.groupBuy.shop?.logo || 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80');
</script>

<template>
  <RouterLink class="group-card" :class="{ compact }" :to="`/groupbuy/${groupBuy.id}`">
    <div class="cover" :style="{ backgroundImage: `url(${cover})` }" />
    <div class="content">
      <div class="title-row">
        <h3>{{ groupBuy.title }}</h3>
        <StatusBadge :status="groupBuy.status" />
      </div>
      <p class="shop-line">{{ groupBuy.shop?.name || '甜品店铺' }} · 团长 {{ groupBuy.leader?.nickname || '社区团长' }}</p>
      <div class="price-row">
        <strong>{{ formatPrice(groupBuy.group_price) }}</strong>
        <span>{{ formatPrice(groupBuy.original_price) }}</span>
      </div>
      <div class="meta-row">
        <span>已接 {{ joinedQuantity }}/{{ groupBuy.min_quantity }}</span>
        <CountdownTimer :deadline="groupBuy.deadline" quiet />
      </div>
      <van-progress :percentage="progress" :show-pivot="false" color="#e35d6a" track-color="#f3e3d2" />
    </div>
  </RouterLink>
</template>

<style scoped>
.group-card {
  display: grid;
  grid-template-columns: 108px minmax(0, 1fr);
  gap: 12px;
  padding: 12px;
  color: inherit;
  text-decoration: none;
  background: #fffaf4;
  border: 1px solid #eedccb;
  border-radius: 8px;
  box-shadow: 0 8px 22px rgba(83, 50, 36, 0.08);
}

.group-card.compact {
  grid-template-columns: 86px minmax(0, 1fr);
}

.cover {
  min-height: 116px;
  border-radius: 8px;
  background-position: center;
  background-size: cover;
}

.content {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.title-row {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  justify-content: space-between;
}

h3 {
  margin: 0;
  color: #33221b;
  font-size: 16px;
  line-height: 1.35;
}

.shop-line,
.meta-row {
  margin: 0;
  color: #7c6a5d;
  font-size: 12px;
}

.price-row,
.meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.price-row strong {
  color: #d94f5d;
  font-size: 20px;
}

.price-row span {
  color: #9a8a7d;
  font-size: 12px;
  text-decoration: line-through;
}
</style>
