<script setup lang="ts">
import type { PickupPoint } from '@/types/groupbuy';

defineProps<{
  point: PickupPoint;
  selected?: boolean;
}>();
</script>

<template>
  <div class="pickup-tag" :class="{ selected }">
    <van-icon name="location-o" />
    <div class="pickup-copy">
      <strong>{{ point.address }}</strong>
      <span>{{ point.available_time }} · 容量 {{ point.max_capacity }}</span>
    </div>
  </div>
</template>

<style scoped>
.pickup-tag {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 12px;
  border: 1px solid #ead8c7;
  border-radius: 8px;
  background: #fffaf4;
  color: #3b2a22;
}

.pickup-tag.selected {
  border-color: #e35d6a;
  background: #fff1f2;
}

.pickup-copy {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.pickup-copy strong {
  line-height: 1.35;
}

.pickup-copy span {
  color: #826d60;
  font-size: 12px;
}
</style>
