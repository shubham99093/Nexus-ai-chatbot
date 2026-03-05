import prisma from '../prisma';
import { AppError } from '../middleware/errorMiddleware';

interface MessageInput {
  role: string;
  content: string;
}

export async function getUserChats(userId: string) {
  return prisma.chat.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      createdAt: true,
    },
  });
}

export async function createChat(userId: string, title: string) {
  return prisma.chat.create({
    data: {
      title,
      userId,
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
    },
  });
}

export async function getChatById(chatId: string, userId: string) {
  const chat = await prisma.chat.findFirst({
    where: { id: chatId, userId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          role: true,
          content: true,
          createdAt: true,
        },
      },
    },
  });

  if (!chat) {
    throw new AppError('Chat not found', 404);
  }

  return chat;
}

export async function deleteChat(chatId: string, userId: string) {
  const chat = await prisma.chat.findFirst({
    where: { id: chatId, userId },
  });

  if (!chat) {
    throw new AppError('Chat not found', 404);
  }

  await prisma.chat.delete({ where: { id: chatId } });
}

export async function renameChat(chatId: string, userId: string, title: string) {
  const chat = await prisma.chat.findFirst({
    where: { id: chatId, userId },
  });

  if (!chat) {
    throw new AppError('Chat not found', 404);
  }

  return prisma.chat.update({
    where: { id: chatId },
    data: { title },
    select: {
      id: true,
      title: true,
      createdAt: true,
    },
  });
}

export async function addMessage(chatId: string, role: string, content: string) {
  return prisma.message.create({
    data: {
      chatId,
      role,
      content,
    },
    select: {
      id: true,
      role: true,
      content: true,
      createdAt: true,
    },
  });
}

export async function getChatMessages(chatId: string): Promise<MessageInput[]> {
  const messages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: 'asc' },
    select: {
      role: true,
      content: true,
    },
  });

  return messages;
}
