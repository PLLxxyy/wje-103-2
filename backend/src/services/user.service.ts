import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { UserRole } from '../types/enums';
import { config } from '../config';
import { prisma } from '../utils/prisma';
import { AppError } from '../utils/response';

const avatarByRole: Record<UserRole, string> = {
  [UserRole.MEMBER]: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=240&q=80',
  [UserRole.LEADER]: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
  [UserRole.ADMIN]: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80'
};

export type RegisterInput = {
  nickname: string;
  phone: string;
  password: string;
  role?: UserRole;
};

export type LoginInput = {
  phone: string;
  password: string;
};

export const sanitizeUser = <T extends { password_hash?: string }>(user: T) => {
  const { password_hash: _passwordHash, ...safeUser } = user;
  return safeUser;
};

export const signToken = (user: {
  id: string;
  phone: string;
  role: string;
  nickname: string;
}) => {
  const expiresIn = config.jwtExpiresIn as SignOptions['expiresIn'];
  return jwt.sign(
    {
      id: user.id,
      phone: user.phone,
      role: user.role,
      nickname: user.nickname
    },
    config.jwtSecret,
    { expiresIn }
  );
};

export const userService = {
  async register(input: RegisterInput) {
    if (!input.nickname?.trim() || !input.phone?.trim() || !input.password) {
      throw new AppError('昵称、手机号和密码不能为空');
    }

    const role = input.role && Object.values(UserRole).includes(input.role) ? input.role : UserRole.MEMBER;
    const password_hash = await bcrypt.hash(input.password, 10);
    const user = await prisma.user.create({
      data: {
        nickname: input.nickname.trim(),
        phone: input.phone.trim(),
        role,
        avatar: avatarByRole[role],
        password_hash
      }
    });

    const safeUser = sanitizeUser(user);
    return { user: safeUser, token: signToken(safeUser) };
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({ where: { phone: input.phone } });
    if (!user) {
      throw new AppError('手机号或密码错误', 401);
    }

    const ok = await bcrypt.compare(input.password, user.password_hash);
    if (!ok) {
      throw new AppError('手机号或密码错误', 401);
    }

    const safeUser = sanitizeUser(user);
    return { user: safeUser, token: signToken(safeUser) };
  },

  async getById(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new AppError('用户不存在', 404);
    }
    return sanitizeUser(user);
  },

  async updateProfile(id: string, input: { nickname?: string; avatar?: string }) {
    const user = await prisma.user.update({
      where: { id },
      data: {
        nickname: input.nickname?.trim(),
        avatar: input.avatar?.trim()
      }
    });
    return sanitizeUser(user);
  },

  async listLeaders() {
    const users = await prisma.user.findMany({
      where: { role: { in: [UserRole.LEADER, UserRole.ADMIN] } },
      orderBy: { created_at: 'desc' }
    });
    return users.map(sanitizeUser);
  }
};
