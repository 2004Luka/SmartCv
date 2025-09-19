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
    <div className="min-h-[90vh] bg-[rgb(var(--color-bg))]">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[rgb(var(--color-text))]">Reset password</h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Please enter your new password below
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="card">
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="form-label">
                  New password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="input-field"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength="6"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="form-label">
                  Confirm password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  className="input-field"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength="6"
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
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword; 