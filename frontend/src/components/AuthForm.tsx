'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 px-4 relative overflow-hidden">
      {/* Background mesh gradient */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-30 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-violet/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-indigo/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in relative z-10">
        {/* Logo / Brand */}
        <div className="text-center flex gap-2 items-center justify-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[2rem] bg-primary-gradient shadow-2xl shadow-accent-violet/20 ring-1 ring-white/20">
            <svg
              className="w-8 h-8 text-white"
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
          <h1 className="text-4xl font-bold text-white tracking-tight font-outfit">NexusChat</h1>
        </div>

        {/* Form Card */}
        <div className="glass shadow-2xl rounded-[2.5rem] p-10 border border-white/10">
          <div className="flex mb-8 bg-white/5 rounded-2xl p-1.5 border border-white/5">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                isLogin
                  ? 'bg-white/10 text-white shadow-lg ring-1 ring-white/10'
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                !isLogin
                  ? 'bg-white/10 text-white shadow-lg ring-1 ring-white/10'
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium animate-fade-in flex items-center gap-3">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-xs font-bold text-dark-400 uppercase tracking-widest ml-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-dark-600 focus:outline-none focus:ring-2 focus:ring-accent-violet/30 focus:border-accent-violet/40 transition-all duration-300 text-[15px] font-medium"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-xs font-bold text-dark-400 uppercase tracking-widest ml-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-dark-600 focus:outline-none focus:ring-2 focus:ring-accent-violet/30 focus:border-accent-violet/40 transition-all duration-300 text-[15px] font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-primary-gradient text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed shadow-xl shadow-accent-violet/20 text-[15px] mt-4 flex items-center justify-center ring-1 ring-white/10"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Syncing Context...
                </div>
              ) : isLogin ? (
                'Login'
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
        </div>

        <div className="flex justify-center items-center gap-2 mt-10">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-violet shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
          <p className="text-dark-500 text-xs font-bold uppercase tracking-[0.2em]">
            AES-256 Encrypted Session
          </p>
        </div>
      </div>
    </div>
  );
}
