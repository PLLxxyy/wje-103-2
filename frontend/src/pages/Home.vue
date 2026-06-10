<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import GroupBuyCard from '@/components/common/GroupBuyCard.vue';
import { useAuth } from '@/hooks/useAuth';
import { useGroupBuyStore } from '@/stores/useGroupBuyStore';
import { useShopStore } from '@/stores/useShopStore';
import { GroupBuyStatus, UserRole, groupBuyStatusText } from '@/types/enums';

const router = useRouter();
const auth = useAuth();
const groupBuyStore = useGroupBuyStore();
const shopStore = useShopStore();
const activeStatus = ref<'all' | GroupBuyStatus>(GroupBuyStatus.RECRUITING);

const statusOptions = [
  { label: '全部', value: 'all' as const },
  { label: groupBuyStatusText[GroupBuyStatus.RECRUITING], value: GroupBuyStatus.RECRUITING },
  { label: groupBuyStatusText[GroupBuyStatus.DELIVERING], value: GroupBuyStatus.DELIVERING },
  { label: groupBuyStatusText[GroupBuyStatus.COMPLETED], value: GroupBuyStatus.COMPLETED }
];

const totalJoined = computed(() =>
  groupBuyStore.list.reduce(
    (sum, item) => sum + (item.joinRecords ?? []).reduce((count, record) => count + Number(record.quantity), 0),
    0
  )
);

const fetchList = () => {
  const status = activeStatus.value === 'all' ? undefined : activeStatus.value;
  return groupBuyStore.fetchList({ status });
};

onMounted(async () => {
  await Promise.all([fetchList(), shopStore.fetchList()]);
});
</script>

<template>
  <main class="page">
    <section class="home-hero">
      <div>
        <span>今日团购</span>
        <h1>附近甜品店，正在等你拼一口。</h1>
      </div>
      <van-button
        v-permission="[UserRole.LEADER, UserRole.ADMIN]"
        type="primary"
        icon="plus"
        @click="router.push('/groupbuy/create')"
      >
        发起
      </van-button>
    </section>

    <section class="metric-strip">
      <div>
        <strong>{{ groupBuyStore.list.length }}</strong>
        <span>团购</span>
      </div>
      <div>
        <strong>{{ totalJoined }}</strong>
        <span>份接龙</span>
      </div>
      <div>
        <strong>{{ shopStore.list.length }}</strong>
        <span>店铺</span>
      </div>
    </section>

    <section class="section">
      <div class="filter-row">
        <button
          v-for="option in statusOptions"
          :key="option.value"
          type="button"
          :class="{ active: activeStatus === option.value }"
          @click="activeStatus = option.value; fetchList()"
        >
          {{ option.label }}
        </button>
      </div>
    </section>

    <section class="section stack">
      <GroupBuyCard v-for="item in groupBuyStore.list" :key="item.id" :group-buy="item" />
      <van-empty v-if="!groupBuyStore.loading && groupBuyStore.list.length === 0" description="暂无匹配团购" />
    </section>

    <section v-if="!auth.currentUser.value" class="panel login-nudge">
      <span>登录后参与接龙和投票</span>
      <van-button size="small" type="primary" @click="router.push('/login')">去登录</van-button>
    </section>
  </main>
</template>

<style scoped>
.home-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  min-height: 180px;
  padding: 18px;
  border-radius: 8px;
  color: #fff8f2;
  background:
    linear-gradient(110deg, rgba(46, 29, 22, 0.78), rgba(46, 29, 22, 0.24)),
    url("https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=900&q=80") center/cover;
}

.home-hero span {
  font-size: 13px;
  font-weight: 700;
}

.home-hero h1 {
  max-width: 9em;
  margin: 8px 0 0;
  font-size: 30px;
  line-height: 1.08;
  letter-spacing: 0;
}

.metric-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 12px;
}

.metric-strip div {
  display: grid;
  gap: 2px;
  padding: 12px;
  border-radius: 8px;
  background: #fffaf4;
  border: 1px solid #ead8c7;
}

.metric-strip strong {
  color: #d94f5d;
  font-size: 21px;
}

.metric-strip span {
  color: #826d60;
  font-size: 12px;
}

.filter-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
}

.filter-row button {
  flex: 0 0 auto;
  min-height: 36px;
  padding: 0 13px;
  border: 1px solid #ead8c7;
  border-radius: 999px;
  color: #62483b;
  background: #fffaf4;
}

.filter-row button.active {
  border-color: #e35d6a;
  color: #fff8f2;
  background: #e35d6a;
}

.login-nudge {
  position: sticky;
  bottom: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 18px;
}
</style>
