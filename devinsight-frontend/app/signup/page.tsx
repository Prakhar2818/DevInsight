"use client";

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../../services/auth.service';
import { setCredentials, setLoading } from '../../store/slices/authSlice';
import { RootState } from '../../store/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    dispatch(setLoading(true));

    try {
      const response = await authService.register({ name, email, password });
      dispatch(setCredentials({ user: response.user, token: response.access_token }));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 relative z-10">
      {/* Left Pane - Art Area */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #fdf4ff 0%, #e0f2fe 50%, #ffedd5 100%)' }}
      >
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>
        <div className="relative z-10 text-center px-12">
          <h2 className="text-5xl font-bold tracking-tight text-slate-800 mb-6 font-sans">
            One Click Away
          </h2>
          <p className="text-lg text-slate-600 font-mono">
            Create your account and unlock studio-grade insights.
          </p>
        </div>
      </div>

      {/* Right Pane - Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-2xl p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Create your account</h1>
            <p className="text-slate-500 text-sm">Start your journey with Insight</p>
          </div>
          
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-100 border border-transparent rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all placeholder:text-slate-400"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-100 border border-transparent rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all placeholder:text-slate-400"
                placeholder="developer@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-100 border border-transparent rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all placeholder:text-slate-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-8 w-full bg-[#feefde] border border-[#ffdbb5] text-slate-900 rounded-xl py-3.5 font-semibold hover:bg-[#ffdbb5] transition-colors shadow-sm disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-4 text-sm text-slate-400">or</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          <div className="space-y-3">
            <button 
              type="button" 
              onClick={() => {
                const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || 'Iv23ligAUKZqQzB4mX3P'; // Defaulting for testing
                window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,user:email`;
              }}
              className="w-full flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <svg height="24" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="24" data-view-component="true" className="octicon octicon-mark-github">
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
              </svg>
              Continue with GitHub
            </button>
            <button type="button" className="w-full flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              Continue with Google
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-sky-500 hover:text-sky-600 transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
