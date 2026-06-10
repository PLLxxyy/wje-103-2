import { GroupBuyStatus, UserRole, VoteStatus } from '../types/enums';
import { prisma } from '../utils/prisma';
import { AppError } from '../utils/response';

const optionInclude = {
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
  },
  groupBuy: true
};

export const voteService = {
  async list(groupBuyId: string) {
    return prisma.voteOption.findMany({
      where: { group_buy_id: groupBuyId },
      include: optionInclude,
      orderBy: { id: 'asc' }
    });
  },

  async createOption(groupBuyId: string, optionText: string, actor: { id: string; role: UserRole }) {
    const groupBuy = await prisma.groupBuy.findUnique({ where: { id: groupBuyId } });
    if (!groupBuy) {
      throw new AppError('团购不存在', 404);
    }
    if (actor.role !== UserRole.ADMIN && groupBuy.leader_id !== actor.id) {
      throw new AppError('只能为自己发起的团购添加投票选项', 403);
    }
    if (!optionText?.trim()) {
      throw new AppError('投票选项不能为空');
    }

    return prisma.voteOption.create({
      data: {
        group_buy_id: groupBuyId,
        option_text: optionText.trim()
      },
      include: optionInclude
    });
  },

  async vote(optionId: string, userId: string) {
    const option = await prisma.voteOption.findUnique({
      where: { id: optionId },
      include: { groupBuy: true }
    });
    if (!option) {
      throw new AppError('投票选项不存在', 404);
    }
    if (option.groupBuy.status !== GroupBuyStatus.RECRUITING || option.groupBuy.deadline <= new Date()) {
      throw new AppError('当前投票已结束');
    }

    const existing = await prisma.voteRecord.findFirst({
      where: {
        user_id: userId,
        voteOption: {
          group_buy_id: option.group_buy_id
        }
      }
    });
    if (existing) {
      throw new AppError('每个团购只能投一票');
    }

    return prisma.voteRecord.create({
      data: {
        vote_option_id: optionId,
        user_id: userId
      },
      include: {
        voteOption: true,
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
    });
  },

  async results(groupBuyId: string) {
    const groupBuy = await prisma.groupBuy.findUnique({ where: { id: groupBuyId } });
    if (!groupBuy) {
      throw new AppError('团购不存在', 404);
    }

    const options = await this.list(groupBuyId);
    const totalVotes = options.reduce((sum, option) => sum + option.voteRecords.length, 0);
    const status =
      groupBuy.status === GroupBuyStatus.RECRUITING && groupBuy.deadline > new Date()
        ? VoteStatus.OPEN
        : VoteStatus.CLOSED;

    return {
      status,
      totalVotes,
      options: options.map((option) => ({
        ...option,
        voteCount: option.voteRecords.length,
        percent: totalVotes === 0 ? 0 : Math.round((option.voteRecords.length / totalVotes) * 100)
      }))
    };
  }
};
