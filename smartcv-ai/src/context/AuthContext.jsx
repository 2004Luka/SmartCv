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
    const token = Cookies.get('token') || localStorage.getItem('token');
    const userData = Cookies.get('user');
    console.log('On mount:', { token, userData });

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Error parsing user data:', error);
        Cookies.remove('token');
        localStorage.removeItem('token');
        Cookies.remove('user');
      }
      setLoading(false);
      return;
    }

    // If token exists but no user cookie, fetch user from backend
    if (token && !userData) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get('http://localhost:5000/api/user/me', { withCredentials: true })
        .then(res => {
          setUser(res.data.user);
          Cookies.set('user', JSON.stringify(res.data.user), { expires: 30, sameSite: 'Lax', path: '/' });
        })
        .catch(() => {
          Cookies.remove('token');
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
      return;
    }

    setLoading(false);
  }, []);

  const getProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user/me', { withCredentials: true });
      setUser(res.data.user);
      Cookies.set('user', JSON.stringify(res.data.user), { expires: 30, sameSite: 'Lax', path: '/' });
    } catch (error) {
      // handle error
    }
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;
      
      // Set cookies with expiration based on remember me
      const expires = rememberMe ? 30 : 1; // 30 days if remember me is checked, 1 day if not
      Cookies.set('token', token, { expires, sameSite: 'Lax', path: '/' });
      localStorage.setItem('token', token);
      Cookies.set('user', JSON.stringify(user), { expires, sameSite: 'Lax', path: '/' });
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      await getProfile();
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
      Cookies.set('token', token, { expires: 1, sameSite: 'Lax', path: '/' });
      localStorage.setItem('token', token);
      Cookies.set('user', JSON.stringify(user), { expires: 1, sameSite: 'Lax', path: '/' });
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      await getProfile();
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

  const updateProfilePicture = async (profilePicture) => {
    if (!user) return;
    try {
      // Update on backend (but don't wait for backend to return new user)
      await axios.put('http://localhost:5000/api/user/profile-picture', { profilePicture }, { withCredentials: true });
    } catch (error) {
      // handle error if needed
    }
    // Immediately update user in state and cookies
    const updatedUser = { ...user, profilePicture };
    setUser(updatedUser);
    Cookies.set('user', JSON.stringify(updatedUser), { expires: 30, sameSite: 'Lax', path: '/' });
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfilePicture,
    getProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 