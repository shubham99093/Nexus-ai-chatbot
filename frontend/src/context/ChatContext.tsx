'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Chat, Message } from '@/lib/types';
import * as api from '@/lib/api';

interface ChatContextType {
  chats: Chat[];
  activeChatId: string | null;
  messages: Message[];
  isStreaming: boolean;
  isLoadingChats: boolean;
  isLoadingMessages: boolean;
  error: string | null;
  loadChats: () => Promise<void>;
  selectChat: (chatId: string) => Promise<void>;
  createNewChat: () => Promise<void>;
  deleteChatById: (chatId: string) => Promise<void>;
  renameChatById: (chatId: string, title: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  clearError: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const selectChat = useCallback(async (chatId: string) => {
    setActiveChatId(chatId);
    setIsLoadingMessages(true);
    setError(null);
    try {
      const data = await api.fetchChat(chatId);
      setMessages(data.messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chat');
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  const createNewChat = useCallback(async () => {
    try {
      const chat = await api.createChat('New Chat');
      setChats((prev) => [chat, ...prev]);
      setActiveChatId(chat.id);
      setMessages([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create chat');
    }
  }, []);

  const loadChats = useCallback(async () => {
    setIsLoadingChats(true);
    try {
      const data = await api.fetchChats();
      setChats(data);

      // Auto-select latest chat or create new one if the view is empty
      if (!activeChatId) {
        if (data.length > 0) {
          selectChat(data[0].id);
        } else {
          createNewChat();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chats');
    } finally {
      setIsLoadingChats(false);
    }
  }, [activeChatId, selectChat, createNewChat]);

  const deleteChatById = useCallback(
    async (chatId: string) => {
      try {
        await api.deleteChat(chatId);
        setChats((prev) => prev.filter((c) => c.id !== chatId));
        if (chatId === activeChatId) {
          setActiveChatId(null);
          setMessages([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete chat');
      }
    },
    [activeChatId],
  );

  const renameChatById = useCallback(async (chatId: string, title: string) => {
    try {
      const updated = await api.renameChat(chatId, title);
      setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, title: updated.title } : c)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rename chat');
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!activeChatId || isStreaming) return;

      const userMessage: Message = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsStreaming(true);
      setError(null);

      let assistantContent = '';
      const assistantMessageId = `temp-assistant-${Date.now()}`;

      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          createdAt: new Date().toISOString(),
        },
      ]);

      await api.streamMessage(
        activeChatId,
        content,
        (chunk) => {
          assistantContent += chunk;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessageId ? { ...m, content: assistantContent } : m,
            ),
          );
        },
        () => {
          setIsStreaming(false);
          // Rename chat with first message if it's still "New Chat"
          setChats((prev) => {
            const chat = prev.find((c) => c.id === activeChatId);
            if (chat && chat.title === 'New Chat') {
              const title = content.slice(0, 40) + (content.length > 40 ? '...' : '');
              api.renameChat(activeChatId, title).catch(() => {});
              return prev.map((c) => (c.id === activeChatId ? { ...c, title } : c));
            }
            return prev;
          });
        },
        (err) => {
          setIsStreaming(false);
          setError(err);
        },
      );
    },
    [activeChatId, isStreaming],
  );

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChatId,
        messages,
        isStreaming,
        isLoadingChats,
        isLoadingMessages,
        error,
        loadChats,
        selectChat,
        createNewChat,
        deleteChatById,
        renameChatById,
        sendMessage,
        clearError,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
