import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero-city.jpg";

const AuthLayout = ({ title, subtitle, children, type = "login" }) => {
  return (
    <div className="min-h-screen w-full flex bg-darkbg text-slate-900 dark:text-slate-100 font-sans">
      
      {/* LEFT: Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative z-10 bg-white dark:bg-darkcard shadow-2xl">
        {/* Subtle mesh background for form area */}
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md mx-auto"
        >
          {/* Logo / Brand */}
          <Link to="/" className="inline-block mb-12">
            <span className="text-3xl font-display font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 transition-all">
              CivicConnect.
            </span>
          </Link>

          <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-2">
            {title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg">
            {subtitle}
          </p>

          <div className="w-full">
            {children}
          </div>

          {/* Toggle Link */}
          <p className="mt-8 text-center text-slate-500 dark:text-slate-400 font-medium">
            {type === "login" ? (
              <>
                Don't have an account?{" "}
                <Link to="/register" className="text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 font-bold transition-colors">
                  Create one now
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link to="/login" className="text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 font-bold transition-colors">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </motion.div>
      </div>

      {/* RIGHT: Image / Branding Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-brand-900">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/90 to-violet-900/90 mix-blend-multiply z-10"></div>
        <img 
          src={heroImage} 
          alt="City view" 
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-400/30 rounded-full blur-[100px] z-20"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-400/30 rounded-full blur-[100px] z-20"></div>

        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-30 flex flex-col justify-center p-20 text-white"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 w-max mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-sm font-semibold tracking-wide uppercase text-white/90">Community First</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-display font-extrabold leading-[1.1] mb-6">
            Your voice shapes <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">the city.</span>
          </h2>
          
          <p className="text-xl text-white/80 font-light leading-relaxed max-w-lg">
            Join thousands of active citizens reporting issues, tracking progress, and building a better tomorrow together.
          </p>
        </motion.div>
      </div>
      
    </div>
  );
};

export default AuthLayout;
