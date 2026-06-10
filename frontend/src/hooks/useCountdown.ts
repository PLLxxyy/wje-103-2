import { computed, onMounted, onUnmounted, ref, unref, type Ref } from 'vue';

export const useCountdown = (deadline: string | Ref<string>) => {
  const now = ref(Date.now());
  let timer: number | undefined;

  const diff = computed(() => Math.max(0, new Date(unref(deadline)).getTime() - now.value));
  const days = computed(() => Math.floor(diff.value / 86_400_000));
  const hours = computed(() => Math.floor((diff.value % 86_400_000) / 3_600_000));
  const minutes = computed(() => Math.floor((diff.value % 3_600_000) / 60_000));
  const seconds = computed(() => Math.floor((diff.value % 60_000) / 1000));
  const expired = computed(() => diff.value <= 0);
  const label = computed(() => {
    if (expired.value) return '已截止';
    if (days.value > 0) return `${days.value}天 ${hours.value}小时`;
    return `${hours.value}小时 ${minutes.value}分 ${seconds.value}秒`;
  });

  onMounted(() => {
    timer = window.setInterval(() => {
      now.value = Date.now();
    }, 1000);
  });

  onUnmounted(() => {
    if (timer) window.clearInterval(timer);
  });

  return {
    days,
    hours,
    minutes,
    seconds,
    expired,
    label
  };
};
