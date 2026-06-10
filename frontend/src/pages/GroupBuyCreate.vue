<script setup lang="ts">
import dayjs from 'dayjs';
import { computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { showSuccessToast } from 'vant';
import { useGroupBuyStore } from '@/stores/useGroupBuyStore';
import { useShopStore } from '@/stores/useShopStore';

const router = useRouter();
const shopStore = useShopStore();
const groupBuyStore = useGroupBuyStore();

const form = reactive({
  title: '',
  description: '',
  shop_id: '',
  original_price: 128,
  group_price: 98,
  min_quantity: 5,
  deadline: dayjs().add(2, 'day').format('YYYY-MM-DDTHH:mm'),
  pickup_notes: '',
  pickupPoints: [
    { address: '朝阳区望京SOHO B座大厅', available_time: '周六 14:00-18:00', max_capacity: 50 }
  ],
  voteOptions: [{ option_text: '草莓味' }, { option_text: '芒果味' }]
});

const selectedShop = computed(() => shopStore.list.find((shop) => shop.id === form.shop_id));

const addPickup = () => {
  form.pickupPoints.push({ address: '', available_time: '', max_capacity: 30 });
};

const removePickup = (index: number) => {
  if (form.pickupPoints.length > 1) form.pickupPoints.splice(index, 1);
};

const addVoteOption = () => {
  form.voteOptions.push({ option_text: '' });
};

const removeVoteOption = (index: number) => {
  form.voteOptions.splice(index, 1);
};

const submit = async () => {
  const groupBuy = await groupBuyStore.create({
    ...form,
    original_price: Number(form.original_price),
    group_price: Number(form.group_price),
    min_quantity: Number(form.min_quantity),
    deadline: new Date(form.deadline).toISOString(),
    pickupPoints: form.pickupPoints.map((point) => ({
      address: point.address,
      available_time: point.available_time,
      max_capacity: Number(point.max_capacity)
    })),
    voteOptions: form.voteOptions.filter((option) => option.option_text.trim())
  });
  showSuccessToast('团购已创建');
  router.replace(`/groupbuy/${groupBuy.id}`);
};

onMounted(async () => {
  await shopStore.fetchList();
  form.shop_id = shopStore.list[0]?.id ?? '';
});
</script>

<template>
  <main class="page create-page">
    <section class="section-title create-title">
      <div>
        <h2>发起团购</h2>
        <p class="muted">{{ selectedShop?.name || '请选择甜品店铺' }}</p>
      </div>
    </section>

    <form class="stack" @submit.prevent="submit">
      <section class="panel stack">
        <select v-model="form.shop_id" class="native-select" required>
          <option v-for="shop in shopStore.list" :key="shop.id" :value="shop.id">
            {{ shop.name }} · {{ shop.address }}
          </option>
        </select>
        <van-field v-model="form.title" label="标题" required />
        <van-field v-model="form.description" label="描述" type="textarea" rows="3" autosize />
        <van-field v-model="form.original_price" label="原价" type="number" />
        <van-field v-model="form.group_price" label="团购价" type="number" />
        <van-field v-model="form.min_quantity" label="起购数量" type="number" />
        <label class="field-label">
          截止时间
          <input v-model="form.deadline" type="datetime-local" required />
        </label>
        <van-field v-model="form.pickup_notes" label="提货说明" type="textarea" rows="2" autosize />
      </section>

      <section class="panel stack">
        <div class="section-title">
          <h2>提货点</h2>
          <van-button size="small" icon="plus" native-type="button" plain @click="addPickup">添加</van-button>
        </div>
        <div v-for="(point, index) in form.pickupPoints" :key="index" class="sub-panel">
          <van-field v-model="point.address" label="地址" required />
          <van-field v-model="point.available_time" label="时间" required />
          <van-field v-model="point.max_capacity" label="容量" type="number" required />
          <van-button
            v-if="form.pickupPoints.length > 1"
            size="small"
            icon="delete-o"
            native-type="button"
            plain
            @click="removePickup(index)"
          >
            删除提货点
          </van-button>
        </div>
      </section>

      <section class="panel stack">
        <div class="section-title">
          <h2>投票选项</h2>
          <van-button size="small" icon="plus" native-type="button" plain @click="addVoteOption">添加</van-button>
        </div>
        <div v-for="(option, index) in form.voteOptions" :key="index" class="vote-option">
          <van-field v-model="option.option_text" />
          <van-button size="small" icon="delete-o" native-type="button" plain @click="removeVoteOption(index)" />
        </div>
      </section>

      <van-button block type="primary" native-type="submit">发布团购</van-button>
    </form>
  </main>
</template>

<style scoped>
.create-title p {
  margin: 4px 0 0;
}

.field-label {
  display: grid;
  gap: 8px;
  color: #826d60;
  font-size: 14px;
}

.field-label input {
  min-height: 42px;
  padding: 0 12px;
  border: 1px solid #ead8c7;
  border-radius: 8px;
  color: #33221b;
  background: #fffaf4;
}

.sub-panel {
  display: grid;
  gap: 8px;
  padding: 10px;
  border: 1px dashed #e7cdb7;
  border-radius: 8px;
  background: #fffdf9;
}

.vote-option {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
}
</style>
