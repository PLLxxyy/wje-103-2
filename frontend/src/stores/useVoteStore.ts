import { defineStore } from 'pinia';
import { voteApi } from '@/api/vote';
import type { VoteOption, VoteResult } from '@/types/groupbuy';

type VoteState = {
  options: VoteOption[];
  result: VoteResult | null;
  loading: boolean;
};

export const useVoteStore = defineStore('vote', {
  state: (): VoteState => ({
    options: [],
    result: null,
    loading: false
  }),
  actions: {
    async fetchResults(groupBuyId: string) {
      this.loading = true;
      try {
        this.result = await voteApi.results(groupBuyId);
        this.options = this.result.options;
        return this.result;
      } finally {
        this.loading = false;
      }
    },
    async vote(optionId: string, groupBuyId: string) {
      const record = await voteApi.vote(optionId);
      await this.fetchResults(groupBuyId);
      return record;
    },
    async createOption(groupBuyId: string, optionText: string) {
      const option = await voteApi.createOption(groupBuyId, optionText);
      await this.fetchResults(groupBuyId);
      return option;
    }
  }
});
