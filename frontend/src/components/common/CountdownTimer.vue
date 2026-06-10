<script setup lang="ts">
import { toRef } from 'vue';
import { useCountdown } from '@/hooks/useCountdown';

const props = defineProps<{
  deadline: string;
  quiet?: boolean;
}>();

const { label, expired } = useCountdown(toRef(props, 'deadline'));
</script>

<template>
  <span class="countdown" :class="{ quiet, expired }">
    {{ label }}
  </span>
</template>

<style scoped>
.countdown {
  color: #9a3f4b;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.quiet {
  color: #7c6a5d;
  font-weight: 600;
}

.expired {
  color: #8c8a86;
}
</style>
