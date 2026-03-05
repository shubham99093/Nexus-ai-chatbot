export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Chat {
  id: string;
  title: string;
  createdAt: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

export interface ChatWithMessages extends Chat {
  messages: Message[];
}

export interface StreamChunk {
  content?: string;
  error?: string;
}
