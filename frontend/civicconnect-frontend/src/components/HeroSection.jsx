import { motion } from "framer-motion";
import heroImage from "../assets/hero-city.jpg";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-darkbg">
      {/* Background Image & Modern Gradient Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-60 mix-blend-luminosity"
        style={{ backgroundImage: `url(${heroImage})` }}
      ></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-darkbg via-darkbg/80 to-transparent"></div>
      
      {/* Decorative Blob */}
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 0.9, 1],
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-[100px] pointer-events-none z-0"
      ></motion.div>

      <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 items-center relative z-10">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* MAIN TITLE */}
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-tight tracking-tight">
            Empower your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">community</span> today.
          </h1>

          {/* SUBTITLE */}
          <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-xl leading-relaxed font-light">
            Report civic issues. Track progress. Get them resolved faster
            with transparent citizen-government collaboration. Your voice matters.
          </p>

          {/* BUTTONS */}
          <div className="mt-10 flex flex-wrap gap-4">
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Link
                to="/dashboard/report-issue"
                className="inline-block px-8 py-4 text-lg bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 whitespace-nowrap"
              >
                Report an Issue
              </Link>
            </motion.div>

            <motion.button
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="px-8 py-4 text-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 rounded-xl font-semibold transition-colors"
            >
              Explore Platform
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;