import { prisma } from '../utils/prisma';
import { AppError } from '../utils/response';

const groupBuyForShop = {
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
  joinRecords: true,
  voteOptions: {
    include: {
      voteRecords: true
    }
  }
};

export const shopService = {
  async list() {
    return prisma.shop.findMany({
      include: {
        dessertItems: true,
        groupBuys: {
          include: groupBuyForShop,
          orderBy: { created_at: 'desc' }
        }
      },
      orderBy: { created_at: 'desc' }
    });
  },

  async detail(id: string) {
    const shop = await prisma.shop.findUnique({
      where: { id },
      include: {
        dessertItems: true,
        groupBuys: {
          include: groupBuyForShop,
          orderBy: { created_at: 'desc' }
        }
      }
    });
    if (!shop) {
      throw new AppError('店铺不存在', 404);
    }
    return shop;
  },

  async dessertItems(shopId: string) {
    await this.detail(shopId);
    return prisma.dessertItem.findMany({
      where: { shop_id: shopId },
      orderBy: [{ category: 'asc' }, { price: 'asc' }]
    });
  }
};
