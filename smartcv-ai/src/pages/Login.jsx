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
    <div className="min-h-[90vh] flex items-center justify-center bg-[rgb(var(--color-bg))] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-[rgb(var(--color-text))]">
            Welcome back
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Sign in to continue tailoring your resume
          </p>
        </div>

        {error && (
          <div className="form-error-message">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="card">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input-field"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="input-field"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 text-[rgb(var(--color-primary))] focus:ring-[rgb(var(--ring))] border-[rgb(var(--color-border))] rounded"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-slate-600 font-medium">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary-hover))] transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="form-submit disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
            
            <div className="text-center">
              <Link
                to="/register"
                className="font-medium text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary-hover))] transition-colors duration-200"
              >
                Don't have an account? Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;