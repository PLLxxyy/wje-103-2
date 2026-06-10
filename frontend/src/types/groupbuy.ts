import type { GroupBuyStatus, VoteStatus } from './enums';
import type { JoinRecord } from './join';
import type { Shop } from './shop';
import type { User } from './user';

export type PickupPoint = {
  id: string;
  group_buy_id: string;
  address: string;
  available_time: string;
  max_capacity: number;
};

export type VoteRecord = {
  id: string;
  vote_option_id: string;
  user_id: string;
  user?: User;
};

export type VoteOption = {
  id: string;
  group_buy_id: string;
  option_text: string;
  voteRecords?: VoteRecord[];
  voteCount?: number;
  percent?: number;
};

export type VoteResult = {
  status: VoteStatus;
  totalVotes: number;
  options: VoteOption[];
};

export type GroupBuy = {
  id: string;
  title: string;
  description: string;
  shop_id: string;
  leader_id: string;
  original_price: number | string;
  group_price: number | string;
  min_quantity: number;
  deadline: string;
  status: GroupBuyStatus;
  pickup_notes?: string | null;
  created_at: string;
  shop?: Shop;
  leader?: User;
  joinRecords?: JoinRecord[];
  pickupPoints?: PickupPoint[];
  voteOptions?: VoteOption[];
};

export type CreateGroupBuyPayload = {
  title: string;
  description: string;
  shop_id: string;
  original_price: number;
  group_price: number;
  min_quantity: number;
  deadline: string;
  pickup_notes?: string;
  pickupPoints: Array<{
    address: string;
    available_time: string;
    max_capacity: number;
  }>;
  voteOptions?: Array<{
    option_text: string;
  }>;
};
