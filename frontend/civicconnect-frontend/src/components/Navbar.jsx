import { useTheme } from "../utils/ThemeContext";
import { useAuth } from "../auth/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout, role } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isHome && !scrolled
          ? "bg-transparent border-b border-white/10 backdrop-blur-sm text-white" 
          : "glass border-x-0 border-t-0 shadow-sm text-slate-800 dark:text-slate-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-violet-600 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform duration-300">
             <span className="text-white font-display font-bold text-lg">C</span>
          </div>
          <span className={`text-xl font-display font-extrabold tracking-tight transition-colors ${
            isHome && !scrolled
              ? "text-white" 
              : "text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-violet-600 dark:from-brand-400 dark:to-violet-400"
          }`}>
            CivicConnect
          </span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4 sm:gap-6">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              isHome && !scrolled
                ? "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                : "bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 border border-transparent dark:border-white/5"
            }`}
          >
            <span className="text-lg">{theme === "dark" ? "🌙" : "☀️"}</span>
          </button>

          <div className="w-px h-6 bg-slate-200 dark:bg-white/10 hidden sm:block"></div>

          {/* If Logged In */}
          {isAuthenticated ? (
            <>
              {role === "ROLE_ADMIN" && (
                <Link
                  to="/admin"
                  className={`text-sm font-semibold transition ${
                    isHome && !scrolled ? "text-white/80 hover:text-white" : "text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-white"
                  }`}
                >
                  Admin
                </Link>
              )}

              <Link
                to="/dashboard"
                className={`text-sm font-semibold transition hidden sm:block ${
                  isHome && !scrolled ? "text-white/80 hover:text-white" : "text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                Dashboard
              </Link>

              <button
                onClick={logout}
                className="btn-secondary py-2 px-4 shadow-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`text-sm font-semibold transition hidden sm:block ${
                  isHome && !scrolled ? "text-white/90 hover:text-white" : "text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="btn-primary py-2 px-5 text-sm"
              >
                Get Started
              </Link>
            </>
          )}

        </div>

      </div>
    </motion.nav>
  );
};

export default Navbar;
