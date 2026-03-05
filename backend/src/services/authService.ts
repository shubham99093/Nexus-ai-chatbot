import bcrypt from 'bcrypt';
import prisma from '../prisma';
import { generateToken } from '../utils/jwt';
import { AppError } from '../middleware/errorMiddleware';
import { logSecurityEvent } from '../utils/logger';

const SALT_ROUNDS = 12;

interface AuthResult {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export async function registerUser(email: string, password: string, ip?: string): Promise<AuthResult> {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new AppError('Email already in use', 409);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
    },
  });

  const token = generateToken(user.id);

  logSecurityEvent('REGISTER_SUCCESS', { userId: user.id, ip });

  return { token, user };
}

export async function loginUser(email: string, password: string, ip?: string): Promise<AuthResult> {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    logSecurityEvent('LOGIN_FAILED', { ip, message: 'User not found' });
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    logSecurityEvent('LOGIN_FAILED', { ip, userId: user.id, message: 'Invalid password' });
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken(user.id);

  logSecurityEvent('LOGIN_SUCCESS', { userId: user.id, ip });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  };
}
