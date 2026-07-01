const features = [
  {
    title: "Report Issues",
    desc: "Easily report civic problems with images and precise location details in seconds."
  },
  {
    title: "Track Status",
    desc: "Follow the progress of your issue from the initial submission to complete resolution."
  },
  {
    title: "Get Notified",
    desc: "Receive real-time updates when municipal authorities take action on your reports."
  }
];

const Features = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h2 className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-2">Why CivicConnect</h2>
        <h3 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6">Built for transparency. Designed for action.</h3>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <div
            key={i}
            className="group relative p-8 rounded-2xl bg-white dark:bg-darkcard border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-2xl hover:shadow-brand-500/10 hover:-translate-y-2 transition-all duration-300 overflow-hidden"
          >
            {/* Subtle glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-600 to-blue-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500 -z-10"></div>
            
            <div className="w-12 h-12 bg-brand-50 dark:bg-brand-500/10 rounded-xl flex items-center justify-center mb-6 border border-brand-100 dark:border-brand-500/20">
              <span className="text-brand-600 dark:text-brand-400 font-bold text-lg">{i + 1}</span>
            </div>
            
            <h3 className="text-2xl font-display font-semibold text-slate-900 dark:text-white mb-3 tracking-tight">
              {f.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
