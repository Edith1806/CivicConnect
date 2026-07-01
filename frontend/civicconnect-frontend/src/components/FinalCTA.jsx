import { Link } from "react-router-dom";

const FinalCTA = () => {
  return (
    <section className="relative overflow-hidden py-24 my-12 mx-4 sm:mx-6 lg:mx-8 rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-900 border border-brand-500/30">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-brand-400/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500/40 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
          Your city improves when you speak up.
        </h2>

        <p className="mt-8 text-xl text-brand-100 max-w-2xl mx-auto font-light leading-relaxed">
          Join CivicConnect today. Make civic issues visible, trackable, and resolvable. Be the change your community needs.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 bg-white text-brand-700 font-bold rounded-xl hover:bg-brand-50 hover:-translate-y-1 shadow-xl shadow-brand-900/50 transition-all text-lg"
          >
            Register Now
          </Link>

          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 border-2 border-brand-300 text-white rounded-xl font-bold hover:bg-brand-500/50 hover:border-brand-100 transition-all text-lg"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
