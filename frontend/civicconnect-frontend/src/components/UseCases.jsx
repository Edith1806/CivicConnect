const useCases = [
  {
    title: "Road & Infrastructure",
    desc: "Report massive potholes, dangerously damaged roads, or broken infrastructure immediately.",
    icon: "🛣️",
    color: "from-blue-500 to-indigo-500",
    shadow: "shadow-blue-500/20"
  },
  {
    title: "Garbage & Sanitation",
    desc: "Help clear overflowing bins, irregular waste collection, and ensure a clean environment.",
    icon: "🗑️",
    color: "from-emerald-500 to-green-500",
    shadow: "shadow-emerald-500/20"
  },
  {
    title: "Water & Drainage",
    desc: "Alert authorities regarding pipe leakages, blocked drains, or severe water scarcity.",
    icon: "💧",
    color: "from-cyan-500 to-blue-500",
    shadow: "shadow-cyan-500/20"
  },
  {
    title: "Public Safety",
    desc: "Instantly report open manholes, unsafe public park areas, or dark unlit streets.",
    icon: "🚨",
    color: "from-rose-500 to-pink-500",
    shadow: "shadow-rose-500/20"
  },
];

const UseCases = () => {
  return (
    <section className="relative py-28 bg-slate-50 dark:bg-slate-900/50 overflow-hidden">
      
      {/* Decorative Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Heading */}
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 dark:text-white leading-tight">
            Issues You Can <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">Resolve</span>
          </h2>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Our platform supports a wide array of civic categories. Let’s clean the city, one report at a time.
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {useCases.map((u, i) => (
            <div
              key={i}
              className="group flex flex-col sm:flex-row gap-6 p-8 rounded-3xl bg-white/70 dark:bg-darkcard/70 backdrop-blur-xl border border-white dark:border-white/10 shadow-glass dark:shadow-glass-dark hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Icon Container */}
              <div
                className={`flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-2xl text-4xl text-white bg-gradient-to-br ${u.color} shadow-lg ${u.shadow} group-hover:scale-[1.15] group-hover:rotate-3 transition-all duration-500 ease-spring`}
              >
                {u.icon}
              </div>

              {/* Text Content */}
              <div className="flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {u.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {u.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;