'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const {
    chats,
    activeChatId,
    isLoadingChats,
    loadChats,
    selectChat,
    createNewChat,
    deleteChatById,
    renameChatById,
  } = useChat();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [chatToDelete, setChatToDelete] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    loadChats();

    // Auto-expand on desktop
    if (window.innerWidth >= 768) {
      setIsCollapsed(false);
    }

    // Listen for mobile toggle event
    const handleToggle = () => setIsCollapsed((prev) => !prev);
    window.addEventListener('toggle-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-sidebar', handleToggle);
  }, [loadChats]);

  const handleRename = async (chatId: string) => {
    if (editTitle.trim()) {
      await renameChatById(chatId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle('');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden animate-fade-in"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 md:relative md:z-20
        flex flex-col flex-shrink-0 glass-dark border-r border-glass-border
        transition-all duration-300 ease-in-out
        ${
          isCollapsed
            ? '-translate-x-full md:translate-x-0 md:w-16'
            : 'translate-x-0 w-[280px] md:w-72'
        }
      `}
      >
        {isCollapsed ? (
          /* Collapsed State (Desktop only usually, hidden on mobile by translate-x-full) */
          <div className="flex flex-col items-center py-6 gap-4 h-full">
            <button
              onClick={() => setIsCollapsed(false)}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-dark-400 hover:text-white hover:bg-glass-hover transition-all duration-200"
              title="Expand sidebar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={createNewChat}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-accent-violet/10 text-accent-violet hover:bg-accent-violet/20 transition-all duration-200"
              title="New chat"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        ) : (
          /* Expanded State */
          <>
            {/* Header */}
            <div className="p-5 border-b border-glass-border">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center shadow-lg shadow-accent-violet/20 ring-1 ring-white/20">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <span className="font-bold text-white text-lg font-outfit tracking-tight">
                    NexusChat
                  </span>
                </div>
                <button
                  onClick={() => setIsCollapsed(true)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-dark-400 hover:text-white hover:bg-glass-hover transition-all duration-200"
                  title="Collapse sidebar"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                    />
                  </svg>
                </button>
              </div>
              <button
                onClick={() => {
                  createNewChat();
                  if (window.innerWidth < 768) setIsCollapsed(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-xl border border-glass-border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                New Conversation
              </button>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto py-4 px-3 scrollbar-none">
              {isLoadingChats ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-white/10 border-t-accent-violet rounded-full animate-spin" />
                </div>
              ) : chats.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center text-dark-500">
                    <svg
                      className="w-7 h-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                  <p className="text-dark-400 text-sm font-medium">No chats found</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {chats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`group flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer transition-all duration-200 border ${
                        activeChatId === chat.id
                          ? 'bg-primary-gradient text-white border-white/20 shadow-lg'
                          : 'text-dark-300 border-transparent hover:bg-glass-hover hover:text-white'
                      }`}
                      onClick={() => {
                        selectChat(chat.id);
                        if (window.innerWidth < 768) setIsCollapsed(true);
                      }}
                    >
                      <svg
                        className={`w-4 h-4 flex-shrink-0 ${activeChatId === chat.id ? 'text-white/80' : 'text-dark-500'}`}
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
                      {editingId === chat.id ? (
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={() => handleRename(chat.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRename(chat.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          autoFocus
                          className="flex-1 bg-white/10 text-white text-sm px-2 py-1 rounded-lg outline-none border border-white/20"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <>
                          <span className="flex-1 text-sm font-medium truncate">{chat.title}</span>
                          <div className="hidden group-hover:flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingId(chat.id);
                                setEditTitle(chat.title);
                              }}
                              className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                              title="Rename"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setChatToDelete(chat);
                              }}
                              className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors"
                              title="Delete"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User Section */}
            <div className="p-4 border-t border-glass-border">
              <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-white/5 border border-glass-border">
                <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-[13px] font-semibold truncate">{user?.email}</p>
                  <p className="text-dark-500 text-[11px] font-medium">Free Plan</p>
                </div>
                <button
                  onClick={logout}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Custom Delete Confirmation Modal */}
      {chatToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setChatToDelete(null)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-sm glass border border-white/10 rounded-3xl p-6 shadow-2xl animate-slide-up bg-dark-950/80">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 mx-auto">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-white text-center mb-2 font-outfit">
              Delete Conversation?
            </h3>
            <p className="text-dark-400 text-center mb-8 text-sm leading-relaxed">
              Are you sure you want to delete{' '}
              <span className="text-white font-medium">"{chatToDelete.title}"</span>? This action
              cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setChatToDelete(null)}
                className="flex-1 py-3 px-4 rounded-xl glass border-white/5 text-white font-semibold hover:bg-white/5 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteChatById(chatToDelete.id);
                  setChatToDelete(null);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg shadow-red-500/20 transition-all active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
