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
            <button type="button" className="w-full flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              Continue with Google
            </button>
            <button type="button" className="w-full flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              Continue with Microsoft
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
