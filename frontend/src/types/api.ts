export type ApiResponse<T> = {
  code: number;
  data: T;
  message: string;
};

export type ListQuery = {
  status?: string;
  shopId?: string;
  leaderId?: string;
  mine?: '1';
};
