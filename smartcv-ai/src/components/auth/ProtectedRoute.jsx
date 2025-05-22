import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// For routes that should only be accessible when NOT logged in (like login/register)
export const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// For routes that should only be accessible when logged in
export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}; 