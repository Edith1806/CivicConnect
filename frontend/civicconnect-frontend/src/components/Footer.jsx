const Footer = () => {
  return (
    <footer className="border-t dark:border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-6 py-6 text-center text-slate-500">
        © {new Date().getFullYear()} CivicConnect · Built by Priincy  
        <br />
        Smart civic issue reporting platform
      </div>
    </footer>
  );
};

export default Footer;
