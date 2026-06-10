import { request } from '@/utils/request';
import type { JoinPayload, JoinRecord, ManageJoinResult } from '@/types/join';

export const joinApi = {
  create(data: JoinPayload) {
    return request.post<JoinRecord>('/joins', data);
  },
  myJoins() {
    return request.get<JoinRecord[]>('/joins/my');
  },
  manage(groupBuyId?: string) {
    return request.get<ManageJoinResult>('/joins/manage', { params: { groupBuyId } });
  },
  markPicked(id: string, picked_up: boolean) {
    return request.patch<JoinRecord>(`/joins/${id}/picked`, { picked_up });
  }
};
