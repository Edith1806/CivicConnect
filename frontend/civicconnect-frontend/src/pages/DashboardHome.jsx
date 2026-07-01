import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchMyIssues } from "../api/issues";
import StatCard from "../components/StatCard";
import { useAuth } from "../auth/AuthContext";
import { motion } from "framer-motion";

const DashboardHome = () => {
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0 });
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();

  useEffect(() => {
    fetchMyIssues()
      .then((data) => {
        const resolved = data.filter((i) => i.status === "RESOLVED" || i.status === "CLOSED").length;
        const pending = data.length - resolved;
        setStats({ total: data.length, resolved, pending });
        
        // Sort by date (descending) and take top 3
        const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentIssues(sorted.slice(0, 3));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-2">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 dark:text-white mb-2">
          Welcome back to CivicConnect
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">
          Here is a quick overview of your civic contributions and recent activity in the community.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        <motion.div variants={itemVariants}>
          <StatCard 
            title="Total Issues Reported" 
            value={stats.total} 
            accent="from-blue-500 to-indigo-500" 
            textAccent="text-blue-600 dark:text-blue-400" 
            icon="📝" 
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <StatCard 
            title="Issues Pending" 
            value={stats.pending} 
            accent="from-amber-400 to-orange-500" 
            textAccent="text-amber-600 dark:text-amber-400" 
            icon="⏳" 
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <StatCard 
            title="Issues Resolved" 
            value={stats.resolved} 
            accent="from-emerald-400 to-teal-500" 
            textAccent="text-emerald-600 dark:text-emerald-400" 
            icon="✅" 
          />
        </motion.div>
      </motion.div>

      {/* Recent Activity Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 bg-white dark:bg-darkcard border border-slate-200/80 dark:border-white/5 p-6 rounded-3xl shadow-glass dark:shadow-glass-dark"
      >
        <h3 className="text-lg font-display font-extrabold text-slate-900 dark:text-white mb-4">
          Your Recent Reports
        </h3>
        {recentIssues.length === 0 ? (
          <p className="text-sm text-slate-500">You haven't reported any issues yet.</p>
        ) : (
          <div className="space-y-4">
            {recentIssues.map((issue) => (
              <div 
                key={issue.id} 
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5 hover:translate-x-1 transition-transform duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {issue.category === "ROAD" && "🛣️"}
                    {issue.category === "WATER" && "🚰"}
                    {issue.category === "ELECTRICITY" && "⚡"}
                    {issue.category === "GARBAGE" && "🗑️"}
                    {issue.category === "DRAINAGE" && "🪠"}
                    {issue.category === "STREET_LIGHT" && "💡"}
                    {issue.category === "OTHER" && "📌"}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                      {issue.category.toLowerCase().replace("_", " ")} Issue
                    </h4>
                    <p className="text-xs text-slate-500 truncate max-w-xs sm:max-w-md">
                      {issue.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full
                    ${
                      issue.status === "OPEN"
                        ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                        : issue.status === "IN_PROGRESS"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50"
                    }
                  `}>
                    {issue.status.replace("_", " ")}
                  </span>
                  <Link 
                    to={`/issues/${issue.id}`}
                    className="text-xs font-bold text-brand-600 hover:text-brand-500"
                  >
                    View &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Actions Panel */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-darkcard border border-slate-800 dark:border-white/5 p-8 md:p-12 shadow-2xl"
      >
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/40 to-violet-900/40 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/20 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
              Ready to make a difference?
            </h2>
            <p className="text-slate-300 max-w-md mx-auto md:mx-0">
              Spotted a pothole, broken streetlight, or illegal dumping? Report it instantly and track its resolution.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
            <Link 
              to="/dashboard/report-issue"
              className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 rounded-xl font-bold text-center transition-all hover:scale-105 hover:shadow-glow shadow-md whitespace-nowrap"
            >
              Report New Issue
            </Link>
            <Link 
              to="/dashboard/community"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold text-center transition-all backdrop-blur-md whitespace-nowrap"
            >
              View Community
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;
