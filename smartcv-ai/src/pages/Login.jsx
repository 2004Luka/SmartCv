import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputClass =
    'w-full rounded-2xl border border-stone-200 bg-white/80 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition';
  const primaryButton =
    'inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:opacity-60';
  const cardClass =
    'rounded-[32px] border border-stone-200/70 bg-white/95 p-8 shadow-[0_35px_90px_rgba(15,23,42,0.12)] backdrop-blur';

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(formData.email, formData.password, formData.rememberMe);
    if (result.success) {
      // Redirect to the page they tried to visit or dashboard
      navigate(location.state?.from || '/dashboard', { replace: true });
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="relative isolate flex min-h-[90vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-emerald-200/30 blur-[110px]" />
        <div className="absolute right-4 bottom-0 h-64 w-64 rounded-full bg-stone-200/40 blur-[120px]" />
      </div>
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-stone-500">SmartCV</p>
          <h2 className="mt-3 text-3xl font-semibold text-stone-900 sm:text-4xl">Welcome back</h2>
          <p className="mt-2 text-sm text-stone-600 sm:text-base">Sign in to continue tailoring your story.</p>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 shadow-sm">
            {error}
          </div>
        )}

        <div className={cardClass}>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <label htmlFor="email" className="text-sm font-semibold text-stone-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={inputClass}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              <label htmlFor="password" className="text-sm font-semibold text-stone-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={inputClass}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-stone-600">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-200"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-500"
              >
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading} className={primaryButton}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="text-center text-sm text-stone-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="font-semibold text-emerald-600 transition hover:text-emerald-500"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;