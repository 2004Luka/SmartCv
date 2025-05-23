import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const token = Cookies.get('token') || localStorage.getItem('token');
    const userData = Cookies.get('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data
        Cookies.remove('token');
        localStorage.removeItem('token');
        Cookies.remove('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;
      
      // Set cookies with expiration based on remember me
      const expires = rememberMe ? 30 : 1; // 30 days if remember me is checked, 1 day if not
      Cookies.set('token', token, { expires });
      localStorage.setItem('token', token);
      Cookies.set('user', JSON.stringify(user), { expires });
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'An error occurred'
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password
      });

      const { token, user } = response.data;
      
      // Set cookies with default expiration (1 day)
      Cookies.set('token', token, { expires: 1 });
      localStorage.setItem('token', token);
      Cookies.set('user', JSON.stringify(user), { expires: 1 });
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'An error occurred'
      };
    }
  };

  const logout = () => {
    // Remove cookies and localStorage
    Cookies.remove('token');
    localStorage.removeItem('token');
    Cookies.remove('user');
    
    // Remove axios default header
    delete axios.defaults.headers.common['Authorization'];
    
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 