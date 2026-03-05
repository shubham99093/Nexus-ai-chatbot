import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import * as chatService from '../services/chatService';
import { streamChatCompletion } from '../services/openrouterService';
import { AppError } from '../middleware/errorMiddleware';

/** Strip HTML tags to prevent stored XSS */
function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

const createChatSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
});

const renameChatSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
});

const sendMessageSchema = z.object({
  chatId: z.string().min(1, 'Chat ID is required'),
  message: z.string().min(1, 'Message cannot be empty'),
});

export async function getChats(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const chats = await chatService.getUserChats(req.userId!);
    res.json(chats);
  } catch (error) {
    next(error);
  }
}

export async function createChat(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { title } = createChatSchema.parse(req.body);
    const chat = await chatService.createChat(req.userId!, title);
    res.status(201).json(chat);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    next(error);
  }
}

export async function getChat(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const chatId = req.params.id as string;
    const chat = await chatService.getChatById(chatId, req.userId!);
    res.json(chat);
  } catch (error) {
    next(error);
  }
}

export async function deleteChat(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const chatId = req.params.id as string;
    await chatService.deleteChat(chatId, req.userId!);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function renameChat(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const chatId = req.params.id as string;
    const { title } = renameChatSchema.parse(req.body);
    const chat = await chatService.renameChat(chatId, req.userId!, title);
    res.json(chat);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    next(error);
  }
}

export async function sendMessage(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { chatId, message } = sendMessageSchema.parse(req.body);

    const chat = await chatService.getChatById(chatId, req.userId!);
    if (!chat) {
      throw new AppError('Chat not found', 404);
    }

    await chatService.addMessage(chatId, 'user', sanitizeInput(message));

    const existingMessages = await chatService.getChatMessages(chatId);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    const openRouterResponse = await streamChatCompletion(existingMessages);

    if (!openRouterResponse.body) {
      throw new AppError('No response body from AI provider', 502);
    }

    let fullAssistantMessage = '';
    const reader = openRouterResponse.body.getReader();
    const decoder = new TextDecoder();

    try {
      let done = false;
      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter((line) => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);

              if (data === '[DONE]') {
                continue;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;

                if (content) {
                  fullAssistantMessage += content;
                  res.write(`data: ${JSON.stringify({ content })}\n\n`);
                }
              } catch {
                // Skip malformed JSON chunks
              }
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    if (fullAssistantMessage.trim()) {
      await chatService.addMessage(chatId, 'assistant', fullAssistantMessage);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    if (!res.headersSent) {
      next(error);
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`);
      res.end();
    }
  }
}
