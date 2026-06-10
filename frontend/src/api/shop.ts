import { request } from '@/utils/request';
import type { DessertItem, Shop } from '@/types/shop';

export const shopApi = {
  list() {
    return request.get<Shop[]>('/shops');
  },
  detail(id: string) {
    return request.get<Shop>(`/shops/${id}`);
  },
  desserts(id: string) {
    return request.get<DessertItem[]>(`/shops/${id}/desserts`);
  }
};
