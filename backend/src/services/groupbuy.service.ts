import { GroupBuyStatus, UserRole } from '../types/enums';
import { prisma } from '../utils/prisma';
import { AppError } from '../utils/response';

const groupBuyInclude = {
  shop: true,
  leader: {
    select: {
      id: true,
      nickname: true,
      phone: true,
      avatar: true,
      role: true,
      created_at: true
    }
  },
  pickupPoints: true,
  joinRecords: {
    include: {
      user: {
        select: {
          id: true,
          nickname: true,
          phone: true,
          avatar: true,
          role: true,
          created_at: true
        }
      },
      pickupPoint: true
    },
    orderBy: {
      joined_at: 'desc' as const
    }
  },
  voteOptions: {
    include: {
      voteRecords: {
        include: {
          user: {
            select: {
              id: true,
              nickname: true,
              phone: true,
              avatar: true,
              role: true,
              created_at: true
            }
          }
        }
      }
    }
  }
};

export type CreateGroupBuyInput = {
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

export const groupBuyService = {
  async closeExpiredRecruiting() {
    await prisma.groupBuy.updateMany({
      where: {
        status: GroupBuyStatus.RECRUITING,
        deadline: { lt: new Date() }
      },
      data: { status: GroupBuyStatus.CLOSED }
    });
  },

  async list(params: { status?: GroupBuyStatus; shopId?: string; leaderId?: string }) {
    await this.closeExpiredRecruiting();
    return prisma.groupBuy.findMany({
      where: {
        status: params.status,
        shop_id: params.shopId,
        leader_id: params.leaderId
      },
      include: groupBuyInclude,
      orderBy: { created_at: 'desc' }
    });
  },

  async detail(id: string) {
    await this.closeExpiredRecruiting();
    const groupBuy = await prisma.groupBuy.findUnique({
      where: { id },
      include: groupBuyInclude
    });
    if (!groupBuy) {
      throw new AppError('团购不存在', 404);
    }
    return groupBuy;
  },

  async create(input: CreateGroupBuyInput, leaderId: string) {
    if (!input.title?.trim() || !input.shop_id || !input.deadline) {
      throw new AppError('团购标题、店铺和截止时间不能为空');
    }
    if (!input.pickupPoints?.length) {
      throw new AppError('至少需要设置一个提货点');
    }
    if (Number(input.group_price) <= 0 || Number(input.original_price) <= 0) {
      throw new AppError('价格必须大于 0');
    }

    const deadline = new Date(input.deadline);
    if (Number.isNaN(deadline.getTime()) || deadline <= new Date()) {
      throw new AppError('截止时间必须晚于当前时间');
    }

    return prisma.groupBuy.create({
      data: {
        title: input.title.trim(),
        description: input.description?.trim() || '团长还没有补充说明',
        shop_id: input.shop_id,
        leader_id: leaderId,
        original_price: input.original_price,
        group_price: input.group_price,
        min_quantity: Number(input.min_quantity),
        deadline,
        pickup_notes: input.pickup_notes?.trim(),
        status: GroupBuyStatus.RECRUITING,
        pickupPoints: {
          create: input.pickupPoints.map((point) => ({
            address: point.address.trim(),
            available_time: point.available_time.trim(),
            max_capacity: Number(point.max_capacity)
          }))
        },
        voteOptions: input.voteOptions?.length
          ? {
              create: input.voteOptions
                .filter((option) => option.option_text?.trim())
                .map((option) => ({ option_text: option.option_text.trim() }))
            }
          : undefined
      },
      include: groupBuyInclude
    });
  },

  async updateStatus(id: string, status: GroupBuyStatus, actor: { id: string; role: UserRole }) {
    if (!Object.values(GroupBuyStatus).includes(status)) {
      throw new AppError('团购状态不合法');
    }

    const groupBuy = await prisma.groupBuy.findUnique({ where: { id } });
    if (!groupBuy) {
      throw new AppError('团购不存在', 404);
    }
    if (actor.role !== UserRole.ADMIN && groupBuy.leader_id !== actor.id) {
      throw new AppError('只能管理自己发起的团购', 403);
    }

    return prisma.groupBuy.update({
      where: { id },
      data: { status },
      include: groupBuyInclude
    });
  }
};
