export enum GroupBuyStatus {
  RECRUITING = 'recruiting',
  CLOSED = 'closed',
  DELIVERING = 'delivering',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum UserRole {
  MEMBER = 'member',
  LEADER = 'leader',
  ADMIN = 'admin'
}

export enum VoteStatus {
  OPEN = 'open',
  CLOSED = 'closed'
}

export const groupBuyStatusText: Record<GroupBuyStatus, string> = {
  [GroupBuyStatus.RECRUITING]: '征集中',
  [GroupBuyStatus.CLOSED]: '已截单',
  [GroupBuyStatus.DELIVERING]: '待提货',
  [GroupBuyStatus.COMPLETED]: '已完成',
  [GroupBuyStatus.CANCELLED]: '已取消'
};
