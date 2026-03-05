import { AuthResponse, Chat, ChatWithMessages } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export async function registerUser(email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchChats(): Promise<Chat[]> {
  return apiFetch<Chat[]>('/api/chats');
}

export async function createChat(title: string): Promise<Chat> {
  return apiFetch<Chat>('/api/chats', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
}

export async function fetchChat(chatId: string): Promise<ChatWithMessages> {
  return apiFetch<ChatWithMessages>(`/api/chats/${chatId}`);
}

export async function deleteChat(chatId: string): Promise<void> {
  return apiFetch<void>(`/api/chats/${chatId}`, { method: 'DELETE' });
}

export async function renameChat(chatId: string, title: string): Promise<Chat> {
  return apiFetch<Chat>(`/api/chats/${chatId}`, {
    method: 'PUT',
    body: JSON.stringify({ title }),
  });
}

export async function streamMessage(
  chatId: string,
  message: string,
  onChunk: (content: string) => void,
  onDone: () => void,
  onError: (error: string) => void,
): Promise<void> {
  const token = getToken();

  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ chatId, message }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Stream failed' }));
      onError(err.error || 'Stream request failed');
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      onError('No response body');
      return;
    }

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter((line) => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);

          if (data === '[DONE]') {
            onDone();
            return;
          }

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              onChunk(parsed.content);
            }
            if (parsed.error) {
              onError(parsed.error);
              return;
            }
          } catch {
            // Skip parse errors
          }
        }
      }
    }

    onDone();
  } catch (error) {
    onError(error instanceof Error ? error.message : 'Stream connection failed');
  }
}
