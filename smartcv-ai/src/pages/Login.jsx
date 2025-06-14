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
    <div className="h-[90vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-extrabold text-white">
            Welcome Back
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Sign in to continue tailoring your resume
          </p>
        </div>
        
        {error && (
          <div className="rounded-2xl bg-red-900/30 border border-red-700 p-4 shadow-lg">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm font-medium text-red-400">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-200 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-inner"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-200 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-inner"
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
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700 rounded-lg"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label htmlFor="rememberMe" className="ml-3 block text-sm text-gray-300 font-medium">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-300"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-8 border border-transparent text-lg font-semibold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 focus:ring-offset-gray-800"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
            
            <div className="text-center">
              <Link
                to="/register"
                className="font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-300"
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