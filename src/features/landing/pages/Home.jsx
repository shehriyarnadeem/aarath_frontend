import React from "react";
import { motion } from "framer-motion";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import Testimonials from "../components/Testimonials";
import Button from "../../../components/Button";
import { ArrowRight } from "lucide-react";

const Home = ({ onGetStarted, onContinueAsGuest }) => {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        onGetStarted={onGetStarted}
        onContinueAsGuest={onContinueAsGuest}
      />
    </div>
  );
};

export default Home;
