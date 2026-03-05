'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { ChatProvider } from '@/context/ChatContext';
import AuthForm from './AuthForm';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';

export default function Layout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-accent-green/30 border-t-accent-green rounded-full animate-spin" />
          <p className="text-dark-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <ChatProvider>
      <div className="flex h-screen bg-dark-950 overflow-hidden relative">
        {/* Background mesh gradient */}
        <div className="absolute inset-0 bg-mesh-gradient opacity-40 pointer-events-none" />
        <Sidebar />
        <ChatWindow />
      </div>
    </ChatProvider>
  );
}
