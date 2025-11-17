import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.VITE_API_URL?.replace(/"/g, '') || 'http://localhost:5000';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();
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

    if (!token) {
      setError('Invalid reset token');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/api/auth/reset-password/${token}`,
        { password }
      );

      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative isolate min-h-[90vh]">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-12 h-72 w-72 rounded-full bg-emerald-200/25 blur-[120px]" />
        <div className="absolute right-0 bottom-6 h-80 w-80 rounded-full bg-lime-200/30 blur-[130px]" />
      </div>
      <div className="mx-auto max-w-md px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-stone-500">Secure update</p>
          <h2 className="mt-3 text-3xl font-semibold text-stone-900">Choose a new password</h2>
          <p className="mt-2 text-sm text-stone-600 sm:text-base">Keep it unique and never shared.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className={cardClass}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-stone-700">
                  New password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className={inputClass}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength="6"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-sm font-semibold text-stone-700">
                  Confirm password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  className={inputClass}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength="6"
                />
              </div>
            </div>

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
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword; 