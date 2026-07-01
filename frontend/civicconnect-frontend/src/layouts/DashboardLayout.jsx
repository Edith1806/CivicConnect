import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-brand-50/40 dark:bg-darkbg text-slate-900 dark:text-slate-100 selection:bg-brand-500/30">
      
      {/* Sidebar */}
      <Sidebar />
      {/* Main */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Decorative background blob */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-brand-500/10 dark:bg-brand-500/5 blur-3xl animate-blob -z-10"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-3xl animate-blob mix-blend-multiply dark:mix-blend-screen animation-delay-2000 -z-10"></div>

        <DashboardNavbar />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
