import HeroSection from "../components/HeroSection";
import Features from "../components/Features";
import UseCases from "../components/UseCases";
import HowItWorks from "../components/HowItWorks";
import FinalCTA from "../components/FinalCTA";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const LandingPage = () => {
  return (
    <div className="space-y-24">
      <Navbar/>
      <HeroSection />
      <Features />
      <UseCases />
      <HowItWorks />
      <FinalCTA />
      <Footer/>
    </div>
  );
};

export default LandingPage;
