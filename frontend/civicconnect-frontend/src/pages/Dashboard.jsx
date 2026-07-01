/*import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/StatCard";
import { fetchMyIssues } from "../api/dashboard";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyIssues()
      .then(issues => {
        const total = issues.length;
        const inProgress = issues.filter(
          i => i.status === "IN_PROGRESS"
        ).length;
        const resolved = issues.filter(
          i => i.status === "RESOLVED"
        ).length;

        setStats({ total, inProgress, resolved });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
     
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold">
          Dashboard
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Overview of your civic activity
        </p>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading dashboard...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Total Issues"
            value={stats.total}
            accent="text-brand"
          />

          <StatCard
            title="In Progress"
            value={stats.inProgress}
            accent="text-yellow-500"
          />

          <StatCard
            title="Resolved"
            value={stats.resolved}
            accent="text-green-500"
          />

          <StatCard
            title="Notifications"
            value="—"
            accent="text-purple-500"
          />

        </div>
      )}

    </DashboardLayout>
  );
};

export default Dashboard;}*/
import Sidebar from "../components/Sidebar";
import { Outlet, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";


const Dashboard = () => {
  const location = useLocation();
  const showFAB = location.pathname !== "/dashboard/report-issue" && location.pathname !== "/admin";

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />

      <main className="flex-1 p-8 relative">
        <Outlet />

        {showFAB && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            whileHover={{ y: -4, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Link
              to="/dashboard/report-issue"
              className="flex items-center gap-2 px-5 py-4 bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 text-white rounded-full font-bold shadow-2xl shadow-brand-500/40 border border-brand-400/20"
            >
              <span className="text-xl">➕</span>
              <span className="hidden sm:inline">Report Issue</span>
            </Link>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

