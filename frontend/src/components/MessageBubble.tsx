import React from 'react';
import { useAuth } from '@/context/AuthContext';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageBubbleProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  isStreaming?: boolean;
}

export default function MessageBubble({ role, content, isStreaming }: MessageBubbleProps) {
  const isUser = role === 'user';
  const { user } = useAuth();

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in group items-center`}
    >
      <div className={`flex gap-4 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div
          className={`w-9 h-9 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 ${
            isUser
              ? 'bg-primary-gradient ring-1 ring-white/20'
              : 'bg-white/5 border border-white/10'
          }`}
        >
          {isUser ? (
            <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold uppercase font-outfit">
              {user?.email?.charAt(0)}
            </div>
          ) : (
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-accent-violet animate-pulse" />
            </div>
          )}
        </div>

        {/* Message Bubble */}
        <div
          className={`px-4 py-2 rounded-3xl text-[14.5px] leading-relaxed shadow-sm transition-all ${
            isUser
              ? 'bg-primary-gradient text-white shadow-accent-violet/10 font-medium'
              : 'text-dark-100 border-white/5 hover:border-white/10'
          }`}
        >
          <div className="whitespace-pre-wrap break-words">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                code: ({ children, className }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !match ? (
                    <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono">
                      {children}
                    </code>
                  ) : (
                    <code className="block bg-white/5 p-3 rounded-xl text-sm font-mono overflow-x-auto my-2 border border-white/5">
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
          {isStreaming && !content && (
            <div className="flex gap-2 py-2">
              <span
                className="w-2.5 h-2.5 bg-accent-violet/40 rounded-full animate-pulse-dot"
                style={{ animationDelay: '0s' }}
              />
              <span
                className="w-2.5 h-2.5 bg-accent-violet/40 rounded-full animate-pulse-dot"
                style={{ animationDelay: '0.2s' }}
              />
              <span
                className="w-2.5 h-2.5 bg-accent-violet/40 rounded-full animate-pulse-dot"
                style={{ animationDelay: '0.4s' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
