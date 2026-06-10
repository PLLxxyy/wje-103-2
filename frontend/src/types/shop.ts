import type { GroupBuy } from './groupbuy';

export type DessertItem = {
  id: string;
  shop_id: string;
  name: string;
  description: string;
  price: number | string;
  image?: string | null;
  category: string;
};

export type Shop = {
  id: string;
  name: string;
  description: string;
  address: string;
  contact_phone: string;
  logo?: string | null;
  created_at: string;
  dessertItems?: DessertItem[];
  groupBuys?: GroupBuy[];
};
