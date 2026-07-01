const steps = [
  { title: "Register or Login", desc: "Create an account in seconds to begin.", icon: "👤", color: "from-blue-500 to-cyan-400" },
  { title: "Report an Issue", desc: "Snap a photo, describe, and tag location.", icon: "📸", color: "from-brand-500 to-indigo-500" },
  { title: "Authority Action", desc: "Officials review and assign resources.", icon: "🔍", color: "from-amber-400 to-orange-500" },
  { title: "Issue Resolved", desc: "Get real-time updates till closure.", icon: "✅", color: "from-emerald-400 to-green-500" }
];

const HowItWorks = () => {
  return (
    <section className="relative py-24 bg-white dark:bg-darkcard overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-brand-500/5 dark:bg-brand-500/10 rounded-[100%] blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="text-sm font-bold tracking-widest text-brand-600 dark:text-brand-400 uppercase mb-3">Simple Process</h2>
          <h3 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 dark:text-white">
            How CivicConnect Works
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          
          {/* Connecting Line (Only visible on MD+) */}
          <div className="hidden md:block absolute top-[45px] left-[10%] right-[10%] h-1 bg-slate-100 dark:bg-slate-800 -z-10 rounded-full">
            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-blue-500 via-brand-500 to-emerald-500 opacity-20"></div>
          </div>

          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center group cursor-pointer">
              
              {/* Step Icon / Circle */}
              <div className="relative mb-8">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${step.color} p-1 shadow-lg shadow-slate-200 dark:shadow-none group-hover:scale-110 transition-transform duration-500 ease-out z-10 relative`}>
                  <div className="w-full h-full bg-white dark:bg-darkcard rounded-full flex items-center justify-center text-3xl shadow-inner relative overflow-hidden">
                    <span className="relative z-10">{step.icon}</span>
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                  </div>
                </div>
                
                {/* Step Number Badge */}
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-sm shadow-md z-20">
                  {i + 1}
                </div>
              </div>

              {/* Text Content */}
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {step.title}
              </h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
