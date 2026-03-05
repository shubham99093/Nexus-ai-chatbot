'use client';

import React, { useState, useRef } from 'react';
import { useChat } from '@/context/ChatContext';

export default function ChatInput() {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isStreaming, activeChatId } = useChat();

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming || !activeChatId) return;

    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    await sendMessage(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px';
  };

  return (
    <div className="p-6 pt-0 pb-4">
      <div className="max-w-4xl mx-auto relative group">
        <div className="absolute inset-0 bg-primary-gradient opacity-[0.03] blur-2xl rounded-3xl pointer-events-none group-focus-within:opacity-[0.08] transition-opacity duration-500" />
        <div className="relative flex items-center gap-3 glass p-2 rounded-[2rem] focus-within:ring-2 focus-within:ring-accent-violet/20 focus-within:border-white/20 transition-all duration-300 shadow-xl shadow-black/20">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={
              !activeChatId
                ? 'Choose a chat to begin...'
                : isStreaming
                  ? 'Processing wisdom...'
                  : 'Message NexusAI...'
            }
            disabled={isStreaming || !activeChatId}
            rows={1}
            className="flex-1 bg-transparent text-white placeholder-dark-500 text-[15px] p-3 pl-5 resize-none outline-none max-h-40 disabled:opacity-50 leading-relaxed font-medium"
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isStreaming || !activeChatId}
            className="w-11 h-11 flex items-center justify-center rounded-[1.25rem] bg-primary-gradient text-white hover:scale-105 active:scale-95 disabled:bg-white/5 disabled:scale-100 disabled:text-dark-600 transition-all duration-300 flex-shrink-0 disabled:cursor-not-allowed shadow-lg shadow-accent-violet/20"
          >
            {isStreaming ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <svg
                className="w-5 h-5 transform rotate-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="flex justify-center gap-6 mt-3 px-4">
          <p className="text-dark-600 text-[11px] font-medium tracking-wide flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-accent-violet ring-2 ring-accent-violet/20" />
            Advanced Intelligence
          </p>
          <p className="text-dark-600 text-[11px] font-medium tracking-wide flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-accent-violet ring-2 ring-accent-violet/20" />
            Real-time Processing
          </p>
          <p className="text-dark-600 text-[11px] font-medium tracking-wide flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-accent-violet ring-2 ring-accent-violet/20" />
            Encrypted History
          </p>
        </div>
      </div>
    </div>
  );
}
