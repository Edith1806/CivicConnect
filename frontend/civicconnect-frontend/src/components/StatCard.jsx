import { motion } from "framer-motion";

const StatCard = ({ title, value, accent, textAccent, icon }) => {
  return (
    <motion.div 
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative group p-6 rounded-2xl bg-white dark:bg-darkcard border border-slate-200 dark:border-white/5 shadow-glass dark:shadow-glass-dark overflow-hidden hover:border-brand-500/30 dark:hover:border-brand-500/20 transition-all duration-300"
    >
      {/* Animated gradient orb */}
      <div className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${accent} rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none`}></div>
      
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase mb-2">
            {title}
          </p>
          <motion.h2 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className={`text-4xl font-display font-extrabold ${textAccent}`}
          >
            {value}
          </motion.h2>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center shadow-lg bg-opacity-10 backdrop-blur-md border border-white/20 dark:border-white/5`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
