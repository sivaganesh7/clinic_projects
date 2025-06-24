import React from 'react';
import HomeNavbar from '../components/Home/HomeNavbar';
import HeroSection from '../components/Home/HeroSection'; // Corrected typo from 'Herosection'
import FeaturesSection from '../components/Home/FeaturesSection';
import WhyChooseSection from '../components/Home/WhyChooseSection';
import ContactSection from '../components/Home/ContactSection';
import Footer from '../components/Home/Footer';

const Homepage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <HomeNavbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <WhyChooseSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;