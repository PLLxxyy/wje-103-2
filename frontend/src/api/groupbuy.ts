import { request } from '@/utils/request';
import type { ListQuery } from '@/types/api';
import type { CreateGroupBuyPayload, GroupBuy } from '@/types/groupbuy';
import type { GroupBuyStatus } from '@/types/enums';

export const groupBuyApi = {
  list(params?: ListQuery) {
    return request.get<GroupBuy[]>('/groupbuys', { params });
  },
  detail(id: string) {
    return request.get<GroupBuy>(`/groupbuys/${id}`);
  },
  create(data: CreateGroupBuyPayload) {
    return request.post<GroupBuy>('/groupbuys', data);
  },
  updateStatus(id: string, status: GroupBuyStatus) {
    return request.patch<GroupBuy>(`/groupbuys/${id}/status`, { status });
  }
};
