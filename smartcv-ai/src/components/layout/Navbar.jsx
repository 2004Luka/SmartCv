import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const primaryButton =
    'inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500';
  const subtleButton =
    'inline-flex items-center justify-center rounded-2xl border border-stone-200/80 bg-white/70 px-4 py-2 text-sm font-semibold text-stone-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-stone-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-40 border-b border-white/60 bg-gradient-to-r from-white/95 via-white/80 to-emerald-50/50 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-stone-900">
          <span className="rounded-2xl bg-emerald-100 px-2.5 py-1 text-sm font-bold uppercase text-emerald-700">Smart</span>
          <span className="text-lg font-semibold text-stone-900">CV</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-2 rounded-2xl border border-transparent bg-white/0 px-2 py-1 text-sm font-medium text-stone-700 transition hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400"
                onClick={() => setOpen(!open)}
                aria-haspopup="menu"
                aria-expanded={open}
              >
                <img
                  src={user.profilePicture || '/default-avatar.png'}
                  alt={user.name ? `${user.name} avatar` : 'Profile'}
                  className="h-10 w-10 rounded-2xl border border-stone-200 object-cover shadow-sm"
                  onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
                />
                <span className="hidden text-left sm:block">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-stone-400">Account</span>
                  <span className="text-sm font-semibold text-stone-900">{user.name || 'Profile'}</span>
                </span>
              </button>
              {open && (
                <div
                  role="menu"
                  className="absolute right-0 mt-3 w-56 rounded-3xl border border-stone-200/80 bg-white/95 p-3 shadow-2xl shadow-emerald-100/60"
                >
                  <Link
                    to="/dashboard"
                    className="block rounded-2xl px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-50 hover:text-stone-900"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    Settings
                  </Link>
                  <Link
                    to="/resumes"
                    className="mt-1 block rounded-2xl px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-50 hover:text-stone-900"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    My Resumes
                  </Link>
                  <button
                    className="mt-2 w-full rounded-2xl bg-rose-50 px-3 py-2 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
                    role="menuitem"
                    onClick={() => { setOpen(false); logout(); }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className={subtleButton}>
                Login
              </Link>
              <Link to="/register" className={primaryButton}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;  