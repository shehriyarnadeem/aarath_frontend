import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import React from "react";

import Button from "../../../components/Button";
import FeaturesSection from "../components/FeaturesSection";
import HeroSection from "../components/HeroSection";
import Testimonials from "../components/Testimonials";

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
