import { defineStore } from 'pinia';
import { joinApi } from '@/api/join';
import type { JoinPayload, JoinRecord, JoinSummary } from '@/types/join';

type JoinState = {
  myJoins: JoinRecord[];
  manageRecords: JoinRecord[];
  summary: JoinSummary | null;
  loading: boolean;
};

export const useJoinStore = defineStore('join', {
  state: (): JoinState => ({
    myJoins: [],
    manageRecords: [],
    summary: null,
    loading: false
  }),
  actions: {
    async create(payload: JoinPayload) {
      const record = await joinApi.create(payload);
      this.myJoins = [record, ...this.myJoins];
      return record;
    },
    async fetchMyJoins() {
      this.loading = true;
      try {
        this.myJoins = await joinApi.myJoins();
        return this.myJoins;
      } finally {
        this.loading = false;
      }
    },
    async fetchManage(groupBuyId?: string) {
      this.loading = true;
      try {
        const data = await joinApi.manage(groupBuyId);
        this.manageRecords = data.records;
        this.summary = data.summary;
        return data;
      } finally {
        this.loading = false;
      }
    },
    async markPicked(id: string, pickedUp: boolean) {
      const record = await joinApi.markPicked(id, pickedUp);
      this.manageRecords = this.manageRecords.map((item) => (item.id === id ? record : item));
      return record;
    }
  }
});
