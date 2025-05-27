import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  console.log('User:', user);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary-600">SmartCv</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center group">
                  <img
                    src={user.profilePicture || '/default-avatar.png'}
                    alt="Profile"
                    className="h-9 w-9 rounded-full object-cover border-2 border-primary-500 group-hover:border-primary-700 transition-colors"
                    onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
                  />
                  <span className="ml-2 text-gray-700 font-medium hidden sm:inline">Dashboard</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 