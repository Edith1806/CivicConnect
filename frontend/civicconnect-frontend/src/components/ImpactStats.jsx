const stats = [
  { value: "10k+", label: "Issues Reported" },
  { value: "92%", label: "Resolution Rate" },
  { value: "500+", label: "Active Authorities" },
  { value: "24/7", label: "Citizen Support" },
];

const ImpactStats = () => {
  return (
    <section className="bg-brand/5 dark:bg-slate-800 py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s, i) => (
          <div key={i}>
            <p className="text-4xl font-extrabold text-brand">
              {s.value}
            </p>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImpactStats;
