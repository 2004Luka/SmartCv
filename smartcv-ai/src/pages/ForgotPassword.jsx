import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.VITE_API_URL?.replace(/"/g, '') || 'http://localhost:5000';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-[90vh] bg-[rgb(var(--color-bg))]">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[rgb(var(--color-text))]">Reset password</h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Enter your email address and we'll send you a reset link
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="card">
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
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {message && (
              <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-3">
                <p className="text-sm font-medium text-green-700">{message}</p>
              </div>
            )}

            {error && (
              <div className="mt-4 form-error-message">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="form-submit disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <Link
                to="/login"
                className="text-sm font-medium text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary-hover))] transition-colors duration-200"
              >
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