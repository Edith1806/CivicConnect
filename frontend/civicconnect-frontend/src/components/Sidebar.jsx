import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { motion } from "framer-motion";

const Sidebar = () => {
  const { logout, role } = useAuth();

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Report Issue", path: "/dashboard/report-issue", icon: "📝" },
    { name: "Community Issues", path: "/dashboard/community", icon: "🌍" },
    { name: "My Issues", path: "/dashboard/issues", icon: "📋" },
    { name: "Profile", path: "/dashboard/profile", icon: "👤" },
  ];

  if (role === "ROLE_ADMIN") {
    links.push({ name: "Admin Dashboard", path: "/admin", icon: "🛡️" });
  }

  return (
    <aside className="w-64 bg-white dark:bg-darkcard border-r border-slate-200 dark:border-white/5 h-screen sticky top-0 flex flex-col hidden md:flex shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-40">
      
      <div className="p-6 border-b border-slate-100 dark:border-white/5">
         <h2 className="text-2xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-violet-600">
           CivicConnect.
         </h2>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-4">
        {links.map((link, idx) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.path === "/dashboard"}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm
              ${isActive 
                ? "bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 shadow-sm border border-brand-100 dark:border-brand-500/20" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200"
              }
            `}
          >
            {({ isActive }) => (
              <>
                <span className={`text-lg transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                  {link.icon}
                </span>
                <span>{link.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator" 
                    className="absolute left-0 w-1 h-8 bg-brand-500 rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-white/5 mt-auto">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
        >
          <span className="text-lg">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
