import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.VITE_API_URL?.replace(/"/g, '') || 'http://localhost:5000';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputClass =
    'w-full rounded-2xl border border-stone-200 bg-white/80 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition';
  const primaryButton =
    'inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:opacity-60';
  const cardClass =
    'rounded-[32px] border border-stone-200/70 bg-white/95 p-8 shadow-[0_35px_90px_rgba(15,23,42,0.12)] backdrop-blur';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post(`${API_URL}/api/auth/forgot-password`, {
        email
      });

      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative isolate min-h-[90vh]">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-4 top-16 h-64 w-64 rounded-full bg-emerald-200/25 blur-[110px]" />
        <div className="absolute right-6 bottom-0 h-72 w-72 rounded-full bg-stone-200/35 blur-[120px]" />
      </div>
      <div className="mx-auto max-w-md px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-stone-500">Password reset</p>
          <h2 className="mt-3 text-3xl font-semibold text-stone-900">Send a secure reset link</h2>
          <p className="mt-2 text-sm text-stone-600 sm:text-base">
            Enter your account email and we’ll guide you the rest of the way.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className={cardClass}>
            <label htmlFor="email" className="text-sm font-semibold text-stone-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={`${inputClass} mt-2`}
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {message && (
              <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-sm">
                {message}
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 shadow-sm">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className={`${primaryButton} mt-6`}>
              {loading ? 'Sending...' : 'Send reset link'}
            </button>

            <div className="mt-4 text-center text-sm text-stone-600">
              Remembered your password?{' '}
              <Link to="/login" className="font-semibold text-emerald-600 transition hover:text-emerald-500">
                Back to login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword; 