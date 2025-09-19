import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  console.log('User:', user);

  return (
    <nav className="border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center min-w-0">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-semibold text-[rgb(var(--color-text))]">SmartCv</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                
                <Link to="/dashboard" className="flex items-center gap-2">
                  <img
                    src={user.profilePicture || '/default-avatar.png'}
                    alt="Profile"
                    className="h-9 w-9 rounded-full object-cover border border-[rgb(var(--color-border))]"
                    onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
                  />
                  <span className="hidden sm:inline text-sm font-medium nav-link">Settings</span>
                </Link>
                <Link to="/resumes" className="flex items-center gap-2">
                  <span className="hidden sm:inline text-sm font-medium nav-link">My Resumes</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm px-3 py-2">Login</Link>
                <Link to="/register" className="btn-primary text-sm px-3 py-2">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;  