import { request } from '@/utils/request';
import type { VoteOption, VoteRecord, VoteResult } from '@/types/groupbuy';

export const voteApi = {
  list(groupBuyId: string) {
    return request.get<VoteOption[]>(`/votes/groupbuy/${groupBuyId}`);
  },
  results(groupBuyId: string) {
    return request.get<VoteResult>(`/votes/groupbuy/${groupBuyId}/results`);
  },
  createOption(groupBuyId: string, option_text: string) {
    return request.post<VoteOption>(`/votes/groupbuy/${groupBuyId}/options`, { option_text });
  },
  vote(optionId: string) {
    return request.post<VoteRecord>(`/votes/${optionId}`);
  }
};
