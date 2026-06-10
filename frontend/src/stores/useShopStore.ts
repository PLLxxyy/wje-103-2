import { defineStore } from 'pinia';
import { shopApi } from '@/api/shop';
import type { DessertItem, Shop } from '@/types/shop';

type ShopState = {
  list: Shop[];
  current: Shop | null;
  desserts: DessertItem[];
  loading: boolean;
};

export const useShopStore = defineStore('shop', {
  state: (): ShopState => ({
    list: [],
    current: null,
    desserts: [],
    loading: false
  }),
  actions: {
    async fetchList() {
      this.loading = true;
      try {
        this.list = await shopApi.list();
        return this.list;
      } finally {
        this.loading = false;
      }
    },
    async fetchDetail(id: string) {
      this.loading = true;
      try {
        this.current = await shopApi.detail(id);
        this.desserts = this.current.dessertItems ?? [];
        return this.current;
      } finally {
        this.loading = false;
      }
    },
    async fetchDesserts(id: string) {
      this.desserts = await shopApi.desserts(id);
      return this.desserts;
    }
  }
});
