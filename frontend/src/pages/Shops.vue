<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import GroupBuyCard from '@/components/common/GroupBuyCard.vue';
import { useShopStore } from '@/stores/useShopStore';
import { formatPrice } from '@/utils/format';

const shopStore = useShopStore();
const selectedId = ref('');

const selectedShop = computed(() => shopStore.current ?? shopStore.list.find((shop) => shop.id === selectedId.value));

const selectShop = async (id: string) => {
  selectedId.value = id;
  await shopStore.fetchDetail(id);
};

onMounted(async () => {
  await shopStore.fetchList();
  if (shopStore.list[0]) {
    await selectShop(shopStore.list[0].id);
  }
});
</script>

<template>
  <main class="page shops-page">
    <section class="section-title">
      <div>
        <h2>甜品店铺</h2>
        <p class="muted">看甜品和团购记录</p>
      </div>
    </section>

    <section class="shop-strip">
      <button
        v-for="shop in shopStore.list"
        :key="shop.id"
        type="button"
        :class="{ active: selectedId === shop.id }"
        @click="selectShop(shop.id)"
      >
        <img :src="shop.logo || ''" :alt="shop.name" />
        <span>{{ shop.name }}</span>
      </button>
    </section>

    <section v-if="selectedShop" class="section shop-hero">
      <img :src="selectedShop.logo || ''" :alt="selectedShop.name" />
      <div>
        <h1>{{ selectedShop.name }}</h1>
        <p>{{ selectedShop.description }}</p>
        <span>{{ selectedShop.address }} · {{ selectedShop.contact_phone }}</span>
      </div>
    </section>

    <section v-if="selectedShop" class="section panel">
      <div class="section-title">
        <h2>甜品</h2>
        <span class="muted">{{ selectedShop.dessertItems?.length || 0 }} 款</span>
      </div>
      <div class="dessert-grid">
        <article v-for="item in selectedShop.dessertItems" :key="item.id">
          <img :src="item.image || ''" :alt="item.name" />
          <div>
            <strong>{{ item.name }}</strong>
            <span>{{ item.category }}</span>
            <p>{{ item.description }}</p>
            <em>{{ formatPrice(item.price) }}</em>
          </div>
        </article>
      </div>
    </section>

    <section v-if="selectedShop" class="section">
      <div class="section-title">
        <h2>团购记录</h2>
        <span class="muted">{{ selectedShop.groupBuys?.length || 0 }} 场</span>
      </div>
      <div class="stack">
        <GroupBuyCard
          v-for="item in selectedShop.groupBuys"
          :key="item.id"
          :group-buy="item"
          compact
        />
        <van-empty v-if="!selectedShop.groupBuys?.length" description="暂无团购记录" />
      </div>
    </section>
  </main>
</template>

<style scoped>
.section-title p {
  margin: 4px 0 0;
}

.shop-strip {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 2px 0 6px;
}

.shop-strip button {
  flex: 0 0 116px;
  display: grid;
  gap: 8px;
  padding: 8px;
  border: 1px solid #ead8c7;
  border-radius: 8px;
  color: #3b2a22;
  background: #fffaf4;
  text-align: left;
}

.shop-strip button.active {
  border-color: #e35d6a;
  background: #fff1f2;
}

.shop-strip img {
  width: 100%;
  aspect-ratio: 1.25;
  object-fit: cover;
  border-radius: 8px;
}

.shop-strip span {
  font-size: 13px;
  font-weight: 700;
}

.shop-hero {
  display: grid;
  grid-template-columns: 118px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background: #fffaf4;
  border: 1px solid #ead8c7;
}

.shop-hero img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
}

.shop-hero h1 {
  margin: 0 0 8px;
  font-size: 22px;
  line-height: 1.2;
}

.shop-hero p {
  margin: 0 0 8px;
  color: #4d382d;
  line-height: 1.55;
}

.shop-hero span {
  color: #826d60;
  font-size: 12px;
}

.dessert-grid {
  display: grid;
  gap: 12px;
}

.dessert-grid article {
  display: grid;
  grid-template-columns: 94px minmax(0, 1fr);
  gap: 12px;
}

.dessert-grid img {
  width: 94px;
  height: 94px;
  object-fit: cover;
  border-radius: 8px;
}

.dessert-grid div {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.dessert-grid span {
  color: #2f8d76;
  font-size: 12px;
  font-weight: 700;
}

.dessert-grid p {
  margin: 0;
  color: #826d60;
  font-size: 13px;
  line-height: 1.45;
}

.dessert-grid em {
  color: #d94f5d;
  font-style: normal;
  font-weight: 800;
}
</style>
