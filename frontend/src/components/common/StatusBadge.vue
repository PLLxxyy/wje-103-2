<script setup lang="ts">
import { computed } from 'vue';
import { GroupBuyStatus, groupBuyStatusText } from '@/constants/enums';

const props = defineProps<{
  status: GroupBuyStatus;
}>();

const tone = computed(() => {
  const map: Record<GroupBuyStatus, string> = {
    [GroupBuyStatus.RECRUITING]: '#e35d6a',
    [GroupBuyStatus.CLOSED]: '#8a6f58',
    [GroupBuyStatus.DELIVERING]: '#2f8d76',
    [GroupBuyStatus.COMPLETED]: '#517a3b',
    [GroupBuyStatus.CANCELLED]: '#767676'
  };
  return map[props.status];
});
</script>

<template>
  <van-tag round :color="tone" text-color="#fff7f2">
    {{ groupBuyStatusText[status] }}
  </van-tag>
</template>
