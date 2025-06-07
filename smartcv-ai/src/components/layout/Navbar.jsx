import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  console.log('User:', user);

  return (
    <nav className="h-[10vh] bg-gray-900 shadow-2xl border-b border-gray-700 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">SmartCv</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center group">
                  <img
                    src={user.profilePicture || '/default-avatar.png'}
                    alt="Profile"
                    className="h-11 w-11 rounded-full object-cover border-3 border-blue-500 group-hover:border-purple-500 transition-all duration-300 shadow-lg group-hover:shadow-blue-500/25"
                    onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
                  />
                  <span className="ml-3 text-white font-semibold text-lg hidden sm:inline group-hover:text-blue-400 transition-colors duration-300">Dashboard</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-2xl text-lg font-semibold transition-all duration-300 border border-gray-600 hover:border-gray-500 transform hover:scale-105"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-2xl text-lg font-semibold transition-all duration-300 border border-gray-600 hover:border-gray-500 transform hover:scale-105"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 px-8 py-3 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
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