import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);
  const now = Date.now();

  await prisma.user.upsert({
    where: { id: '1' },
    update: {
      nickname: '小甜甜',
      phone: '13800000001',
      role: 'leader',
      password_hash: passwordHash
    },
    create: {
      id: '1',
      nickname: '小甜甜',
      phone: '13800000001',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
      role: 'leader',
      password_hash: passwordHash
    }
  });

  await prisma.user.upsert({
    where: { id: '2' },
    update: {
      nickname: '甜甜爱好者',
      phone: '13800000002',
      role: 'member',
      password_hash: passwordHash
    },
    create: {
      id: '2',
      nickname: '甜甜爱好者',
      phone: '13800000002',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=240&q=80',
      role: 'member',
      password_hash: passwordHash
    }
  });

  await prisma.shop.upsert({
    where: { id: '1' },
    update: {
      name: '蜜糖烘焙坊',
      description: '主打手作奶油蛋糕和季节水果甜品，适合社区团购与家庭聚会。',
      address: '北京市朝阳区甜品街1号',
      contact_phone: '010-88880001',
      logo: 'https://images.unsplash.com/photo-1557925923-cd4648e211a0?auto=format&fit=crop&w=500&q=80'
    },
    create: {
      id: '1',
      name: '蜜糖烘焙坊',
      description: '主打手作奶油蛋糕和季节水果甜品，适合社区团购与家庭聚会。',
      address: '北京市朝阳区甜品街1号',
      contact_phone: '010-88880001',
      logo: 'https://images.unsplash.com/photo-1557925923-cd4648e211a0?auto=format&fit=crop&w=500&q=80'
    }
  });

  await prisma.shop.upsert({
    where: { id: '2' },
    update: {
      name: '甜蜜时光蛋糕店',
      description: '社区老牌甜品店，供应经典意式甜品、布丁和节庆蛋糕。',
      address: '北京市海淀区糕点路88号',
      contact_phone: '010-88880002',
      logo: 'https://images.unsplash.com/photo-1464195244916-405fa0a82545?auto=format&fit=crop&w=500&q=80'
    },
    create: {
      id: '2',
      name: '甜蜜时光蛋糕店',
      description: '社区老牌甜品店，供应经典意式甜品、布丁和节庆蛋糕。',
      address: '北京市海淀区糕点路88号',
      contact_phone: '010-88880002',
      logo: 'https://images.unsplash.com/photo-1464195244916-405fa0a82545?auto=format&fit=crop&w=500&q=80'
    }
  });

  const desserts = [
    ['1', '1', '草莓奶油蛋糕', '当季草莓、轻盈奶油和戚风蛋糕胚。', 128, 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=600&q=80', '蛋糕'],
    ['2', '1', '芒果千层', '薄饼皮叠入芒果果肉和香草奶油。', 88, 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=600&q=80', '千层'],
    ['3', '1', '抹茶慕斯', '宇治抹茶粉搭配清爽乳酪慕斯。', 68, 'https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=600&q=80', '慕斯'],
    ['4', '2', '提拉米苏', '马斯卡彭、咖啡酒和可可粉的经典组合。', 98, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80', '经典甜品'],
    ['5', '2', '焦糖布丁', '焦糖脆面与顺滑蛋奶布丁。', 38, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80', '布丁']
  ] as const;

  for (const [id, shopId, name, description, price, image, category] of desserts) {
    await prisma.dessertItem.upsert({
      where: { id },
      update: {
        shop_id: shopId,
        name,
        description,
        price,
        image,
        category
      },
      create: {
        id,
        shop_id: shopId,
        name,
        description,
        price,
        image,
        category
      }
    });
  }

  await prisma.groupBuy.upsert({
    where: { id: '1' },
    update: {
      title: '草莓奶油蛋糕团购',
      description: '每日现做，6 寸草莓奶油蛋糕，适合周末家庭下午茶。',
      shop_id: '1',
      leader_id: '1',
      original_price: 128,
      group_price: 98,
      min_quantity: 5,
      deadline: new Date(now + 3 * 24 * 60 * 60 * 1000),
      status: 'recruiting',
      pickup_notes: '请凭手机号后四位提货，蛋糕需冷藏。'
    },
    create: {
      id: '1',
      title: '草莓奶油蛋糕团购',
      description: '每日现做，6 寸草莓奶油蛋糕，适合周末家庭下午茶。',
      shop_id: '1',
      leader_id: '1',
      original_price: 128,
      group_price: 98,
      min_quantity: 5,
      deadline: new Date(now + 3 * 24 * 60 * 60 * 1000),
      status: 'recruiting',
      pickup_notes: '请凭手机号后四位提货，蛋糕需冷藏。'
    }
  });

  await prisma.groupBuy.upsert({
    where: { id: '2' },
    update: {
      title: '蜜糖烘焙坊千层专场',
      description: '芒果、草莓、榴莲三种千层口味投票后统一备货。',
      shop_id: '1',
      leader_id: '1',
      original_price: 88,
      group_price: 68,
      min_quantity: 8,
      deadline: new Date(now + 5 * 24 * 60 * 60 * 1000),
      status: 'recruiting',
      pickup_notes: '提货时请保持外包装平放，建议 2 小时内食用。'
    },
    create: {
      id: '2',
      title: '蜜糖烘焙坊千层专场',
      description: '芒果、草莓、榴莲三种千层口味投票后统一备货。',
      shop_id: '1',
      leader_id: '1',
      original_price: 88,
      group_price: 68,
      min_quantity: 8,
      deadline: new Date(now + 5 * 24 * 60 * 60 * 1000),
      status: 'recruiting',
      pickup_notes: '提货时请保持外包装平放，建议 2 小时内食用。'
    }
  });

  const pickupPoints = [
    ['1', '1', '朝阳区望京SOHO B座大厅', '周六 14:00-18:00', 50],
    ['2', '1', '朝阳区国贸CBD一楼前台', '周日 10:00-12:00', 30],
    ['3', '2', '海淀区中关村创业大街入口', '周六 15:00-17:00', 40]
  ] as const;

  for (const [id, groupBuyId, address, availableTime, maxCapacity] of pickupPoints) {
    await prisma.pickupPoint.upsert({
      where: { id },
      update: {
        group_buy_id: groupBuyId,
        address,
        available_time: availableTime,
        max_capacity: maxCapacity
      },
      create: {
        id,
        group_buy_id: groupBuyId,
        address,
        available_time: availableTime,
        max_capacity: maxCapacity
      }
    });
  }

  const joinRecords = [
    ['1', '1', '2', '草莓味', 1, '1', false],
    ['2', '1', '2', '巧克力味', 2, '2', false],
    ['3', '2', '2', '原味芒果', 1, '3', false],
    ['4', '1', '1', '草莓味', 3, '1', false],
    ['5', '2', '1', '榴莲味', 2, '3', false]
  ] as const;

  for (const [id, groupBuyId, userId, flavor, quantity, pickupPointId, pickedUp] of joinRecords) {
    await prisma.joinRecord.upsert({
      where: { id },
      update: {
        group_buy_id: groupBuyId,
        user_id: userId,
        flavor,
        quantity,
        pickup_point_id: pickupPointId,
        picked_up: pickedUp
      },
      create: {
        id,
        group_buy_id: groupBuyId,
        user_id: userId,
        flavor,
        quantity,
        pickup_point_id: pickupPointId,
        picked_up: pickedUp
      }
    });
  }

  const voteOptions = [
    ['1', '2', '草莓千层'],
    ['2', '2', '芒果千层'],
    ['3', '2', '榴莲千层']
  ] as const;

  for (const [id, groupBuyId, optionText] of voteOptions) {
    await prisma.voteOption.upsert({
      where: { id },
      update: {
        group_buy_id: groupBuyId,
        option_text: optionText
      },
      create: {
        id,
        group_buy_id: groupBuyId,
        option_text: optionText
      }
    });
  }

  await prisma.voteRecord.upsert({
    where: { id: '1' },
    update: {
      vote_option_id: '2',
      user_id: '1'
    },
    create: {
      id: '1',
      vote_option_id: '2',
      user_id: '1'
    }
  });

  await prisma.voteRecord.upsert({
    where: { id: '2' },
    update: {
      vote_option_id: '1',
      user_id: '2'
    },
    create: {
      id: '2',
      vote_option_id: '1',
      user_id: '2'
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
