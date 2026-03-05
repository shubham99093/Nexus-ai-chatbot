'use client';

import React, { useEffect, useRef } from 'react';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

export default function ChatWindow() {
  const { user } = useAuth();
  const {
    messages,
    activeChatId,
    chats,
    isStreaming,
    isLoadingChats,
    isLoadingMessages,
    error,
    clearError,
    sendMessage,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find((c) => c.id === activeChatId);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [messages]);

  // Handle initial load to prevent welcome screen blink
  if (isLoadingChats && !activeChatId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-white/5 border-t-accent-violet rounded-full animate-spin shadow-[0_0_15px_rgba(139,92,246,0.3)]" />
          <p className="text-dark-500 text-sm font-bold uppercase tracking-widest animate-pulse">
            Initializing NexusAI...
          </p>
        </div>
      </div>
    );
  }

  if (!activeChatId) {
    return (
      <div className="flex-1 flex flex-col relative z-10">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center animate-fade-in max-w-md">
            <div className="w-24 h-24 mx-auto mb-8 rounded-[2rem] bg-primary-gradient p-[1px] shadow-2xl shadow-accent-violet/20 ring-1 ring-white/10">
              <div className="w-full h-full rounded-[2rem] bg-dark-900/40 backdrop-blur-xl flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 relative z-10">
      {/* Universal Header with Profile Settings */}
      <header className="flex items-center justify-between px-6 py-4 glass border-b border-white/5 animate-fade-in">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('toggle-sidebar'))}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-dark-400 hover:text-white transition-all shadow-inner"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="flex flex-col">
            <h2 className="text-white font-bold font-outfit tracking-tight text-md leading-none">
              {activeChat?.title || 'NexusAI'}
            </h2>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-bold text-dark-500 uppercase tracking-widest">
                Active Session
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Error Banner */}

      {error && (
        <div className="mx-6 mt-6 p-4 glass-dark border-red-500/20 rounded-2xl flex items-center justify-between animate-fade-in shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <span className="text-red-400 text-sm font-medium">{error}</span>
          </div>
          <button onClick={clearError} className="text-dark-500 hover:text-white transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-6 py-4 scrollbar-none">
        <div className="max-w-4xl mx-auto space-y-5">
          {isLoadingMessages ? (
            <div className="flex justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-white/5 border-t-accent-violet rounded-full animate-spin" />
                <p className="text-dark-500 text-sm font-medium animate-pulse">
                  Loading conversation...
                </p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-in relative overflow-hidden">
              {/* Decorative background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-violet/5 blur-[120px] rounded-full pointer-events-none" />

              <div className="max-w-2xl w-full text-center relative z-10">
                <div className="w-24 h-24 mx-auto mb-10 rounded-[2.5rem] bg-primary-gradient p-[1px] shadow-2xl shadow-accent-violet/20 group hover:scale-110 transition-transform duration-500">
                  <div className="w-full h-full rounded-[2.5rem] bg-dark-950 flex items-center justify-center ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
                    <svg
                      className="w-12 h-12 text-white animate-pulse-slow"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-outfit tracking-tight leading-tight">
                  How can I help you <br />
                  <span className="bg-primary-gradient bg-clip-text text-transparent">
                    brainstorm today?
                  </span>
                </h1>

                <p className="text-dark-400 text-lg mb-12 max-w-lg mx-auto leading-relaxed">
                  I'm your intelligent collaborator. Choose a starter below or type anything to
                  begin our session.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  {[
                    {
                      icon: '🚀',
                      title: 'Code Assistant',
                      text: 'Help me write a React component using Tailwind',
                    },
                    {
                      icon: '💡',
                      title: 'Creative Ideas',
                      text: 'Brainstorm 5 unique gift ideas for a tech lover',
                    },
                    {
                      icon: '📝',
                      title: 'Content Writing',
                      text: 'Draft a professional email for a project proposal',
                    },
                    {
                      icon: '🧠',
                      title: 'Learn Something',
                      text: 'Explain how quantum computing works simply',
                    },
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(item.text)}
                      className="group p-5 glass border-white/5 hover:border-accent-violet/30 rounded-2xl text-left transition-all duration-300 hover:scale-[1.02] hover:bg-white/[0.03] active:scale-[0.98]"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-2xl pt-1">{item.icon}</span>
                        <div>
                          <p className="text-white font-bold text-sm mb-1 group-hover:text-accent-violet transition-colors">
                            {item.title}
                          </p>
                          <p className="text-dark-400 text-xs line-clamp-2 leading-relaxed">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <MessageBubble
                key={msg.id}
                role={msg.role}
                content={msg.content}
                isStreaming={
                  isStreaming && index === messages.length - 1 && msg.role === 'assistant'
                }
              />
            ))
          )}
          <div ref={messagesEndRef} className="h-0" />
        </div>
      </div>

      {/* Input */}
      <ChatInput />
    </div>
  );
}
