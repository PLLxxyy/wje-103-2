import type { GroupBuy, PickupPoint } from './groupbuy';
import type { User } from './user';

export type JoinRecord = {
  id: string;
  group_buy_id: string;
  user_id: string;
  flavor: string;
  quantity: number;
  pickup_point_id: string;
  picked_up: boolean;
  joined_at: string;
  groupBuy?: GroupBuy;
  user?: User;
  pickupPoint?: PickupPoint;
};

export type JoinPayload = {
  group_buy_id: string;
  flavor: string;
  quantity: number;
  pickup_point_id: string;
};

export type JoinSummary = {
  totalQuantity: number;
  totalOrders: number;
  pickedUpOrders: number;
  byFlavor: Array<{ flavor: string; quantity: number; orders: number }>;
  byPickupPoint: Array<{
    pickup_point_id: string;
    address: string;
    available_time: string;
    quantity: number;
    orders: number;
  }>;
};

export type ManageJoinResult = {
  records: JoinRecord[];
  summary: JoinSummary;
};
