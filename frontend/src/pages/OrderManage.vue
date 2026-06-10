<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { showSuccessToast } from 'vant';
import PickupPointTag from '@/components/common/PickupPointTag.vue';
import StatusBadge from '@/components/common/StatusBadge.vue';
import { useGroupBuyStore } from '@/stores/useGroupBuyStore';
import { useJoinStore } from '@/stores/useJoinStore';
import { GroupBuyStatus, groupBuyStatusText } from '@/types/enums';
import { formatDateTime, maskPhone } from '@/utils/format';

const groupBuyStore = useGroupBuyStore();
const joinStore = useJoinStore();
const selectedGroupBuyId = ref('');

const selectedGroupBuy = computed(() =>
  groupBuyStore.list.find((item) => item.id === selectedGroupBuyId.value)
);

const statusOptions = [
  GroupBuyStatus.CLOSED,
  GroupBuyStatus.DELIVERING,
  GroupBuyStatus.COMPLETED,
  GroupBuyStatus.CANCELLED
];

const loadManage = async () => {
  if (selectedGroupBuyId.value) {
    await joinStore.fetchManage(selectedGroupBuyId.value);
  }
};

const togglePicked = async (id: string, picked: boolean) => {
  await joinStore.markPicked(id, picked);
  await loadManage();
  showSuccessToast('提货状态已更新');
};

const changeStatus = async (status: GroupBuyStatus) => {
  if (!selectedGroupBuyId.value) return;
  await groupBuyStore.updateStatus(selectedGroupBuyId.value, status);
  showSuccessToast('团购状态已更新');
};

watch(selectedGroupBuyId, loadManage);

onMounted(async () => {
  await groupBuyStore.fetchList({ mine: '1' });
  selectedGroupBuyId.value = groupBuyStore.list[0]?.id ?? '';
  await loadManage();
});
</script>

<template>
  <main class="page manage-page">
    <section class="section-title">
      <div>
        <h2>订单管理</h2>
        <p class="muted">按口味和提货点核对接龙</p>
      </div>
    </section>

    <section class="panel stack">
      <select v-model="selectedGroupBuyId" class="native-select">
        <option v-for="item in groupBuyStore.list" :key="item.id" :value="item.id">
          {{ item.title }}
        </option>
      </select>
      <div v-if="selectedGroupBuy" class="manage-current">
        <div>
          <strong>{{ selectedGroupBuy.title }}</strong>
          <span>{{ formatDateTime(selectedGroupBuy.deadline) }}</span>
        </div>
        <StatusBadge :status="selectedGroupBuy.status" />
      </div>
      <div v-if="selectedGroupBuy" class="status-actions">
        <van-button
          v-for="status in statusOptions"
          :key="status"
          size="small"
          :type="selectedGroupBuy.status === status ? 'primary' : 'default'"
          @click="changeStatus(status)"
        >
          {{ groupBuyStatusText[status] }}
        </van-button>
      </div>
    </section>

    <section v-if="joinStore.summary" class="section summary-grid">
      <div class="panel">
        <span>接龙</span>
        <strong>{{ joinStore.summary.totalOrders }}</strong>
      </div>
      <div class="panel">
        <span>份数</span>
        <strong>{{ joinStore.summary.totalQuantity }}</strong>
      </div>
      <div class="panel">
        <span>已提</span>
        <strong>{{ joinStore.summary.pickedUpOrders }}</strong>
      </div>
    </section>

    <section v-if="joinStore.summary" class="section panel">
      <div class="section-title">
        <h2>口味统计</h2>
      </div>
      <div class="stat-list">
        <div v-for="item in joinStore.summary.byFlavor" :key="item.flavor">
          <span>{{ item.flavor }}</span>
          <strong>{{ item.quantity }} 份 / {{ item.orders }} 单</strong>
        </div>
      </div>
    </section>

    <section v-if="joinStore.summary" class="section panel">
      <div class="section-title">
        <h2>提货点统计</h2>
      </div>
      <div class="stack">
        <div v-for="item in joinStore.summary.byPickupPoint" :key="item.pickup_point_id" class="pickup-stat">
          <PickupPointTag
            :point="{
              id: item.pickup_point_id,
              group_buy_id: selectedGroupBuyId,
              address: item.address,
              available_time: item.available_time,
              max_capacity: item.quantity
            }"
          />
          <strong>{{ item.quantity }} 份 / {{ item.orders }} 单</strong>
        </div>
      </div>
    </section>

    <section class="section panel">
      <div class="section-title">
        <h2>接龙明细</h2>
        <span class="muted">{{ joinStore.manageRecords.length }} 条</span>
      </div>
      <div class="stack">
        <article v-for="record in joinStore.manageRecords" :key="record.id" class="record-card">
          <div class="record-main">
            <div>
              <strong>{{ record.user?.nickname }}</strong>
              <span>{{ maskPhone(record.user?.phone || '') }}</span>
            </div>
            <div>
              <strong>{{ record.flavor }} × {{ record.quantity }}</strong>
              <span>{{ record.pickupPoint?.address }}</span>
            </div>
          </div>
          <van-button
            size="small"
            :type="record.picked_up ? 'success' : 'primary'"
            plain
            @click="togglePicked(record.id, !record.picked_up)"
          >
            {{ record.picked_up ? '已提货' : '标记提货' }}
          </van-button>
        </article>
        <van-empty v-if="!joinStore.loading && joinStore.manageRecords.length === 0" description="暂无接龙记录" />
      </div>
    </section>
  </main>
</template>

<style scoped>
.section-title p {
  margin: 4px 0 0;
}

.manage-current {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.manage-current div {
  display: grid;
  gap: 4px;
}

.manage-current span {
  color: #826d60;
  font-size: 12px;
}

.status-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
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

.stat-list {
  display: grid;
  gap: 10px;
}

.stat-list div,
.pickup-stat,
.record-card {
  display: grid;
  gap: 10px;
}

.stat-list div {
  grid-template-columns: 1fr auto;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #ead8c7;
}

.stat-list div:last-child {
  border-bottom: 0;
}

.record-card {
  padding: 12px;
  border: 1px solid #ead8c7;
  border-radius: 8px;
  background: #fffaf4;
}

.record-main {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 12px;
}

.record-main div {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.record-main span {
  overflow: hidden;
  color: #826d60;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
