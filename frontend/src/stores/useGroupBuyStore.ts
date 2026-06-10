import { defineStore } from 'pinia';
import { groupBuyApi } from '@/api/groupbuy';
import type { ListQuery } from '@/types/api';
import type { CreateGroupBuyPayload, GroupBuy } from '@/types/groupbuy';
import type { GroupBuyStatus } from '@/types/enums';

type GroupBuyState = {
  list: GroupBuy[];
  current: GroupBuy | null;
  loading: boolean;
};

export const useGroupBuyStore = defineStore('groupBuy', {
  state: (): GroupBuyState => ({
    list: [],
    current: null,
    loading: false
  }),
  getters: {
    activeCount: (state) => state.list.filter((item) => item.status === 'recruiting').length
  },
  actions: {
    async fetchList(params?: ListQuery) {
      this.loading = true;
      try {
        this.list = await groupBuyApi.list(params);
        return this.list;
      } finally {
        this.loading = false;
      }
    },
    async fetchDetail(id: string) {
      this.loading = true;
      try {
        this.current = await groupBuyApi.detail(id);
        return this.current;
      } finally {
        this.loading = false;
      }
    },
    async create(payload: CreateGroupBuyPayload) {
      const groupBuy = await groupBuyApi.create(payload);
      this.list = [groupBuy, ...this.list];
      this.current = groupBuy;
      return groupBuy;
    },
    async updateStatus(id: string, status: GroupBuyStatus) {
      const groupBuy = await groupBuyApi.updateStatus(id, status);
      this.current = this.current?.id === id ? groupBuy : this.current;
      this.list = this.list.map((item) => (item.id === id ? groupBuy : item));
      return groupBuy;
    }
  }
});
