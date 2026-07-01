import { useAuth } from "../auth/AuthContext";
import { useTheme } from "../utils/ThemeContext";

const DashboardNavbar = () => {
  const { logout } = useAuth();
  const { toggleTheme } = useTheme();

  return (
    <header className="h-20 px-8 flex justify-end items-center gap-6 glass border-l-0 sticky top-0 z-30">
      <button
        onClick={toggleTheme}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 transition-all shadow-sm"
      >
        <span className="text-xl">🌗</span>
      </button>

      <button
        onClick={logout}
        className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-red-500/25 hover:shadow-red-500/40"
      >
        Logout
      </button>
    </header>
  );
};

export default DashboardNavbar;
