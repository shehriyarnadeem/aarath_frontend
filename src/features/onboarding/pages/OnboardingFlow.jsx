import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Logo from "../../../components/Logo";
import Button from "../../../components/Button";
import RoleSelection from "../components/RoleSelection";
import LocationSelection from "../components/LocationSelection";
import CategorySelection from "../components/CategorySelection";
import { useAuth } from "../../../context/AuthContext";
import { apiClient } from "../../../api/client";

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuth();

  // Form data
  const [formData, setFormData] = useState({
    role: "",
    state: "",
    city: "",
    businessCategories: [],
  });

  const totalSteps = 3;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleStateSelect = (state) => {
    setFormData((prev) => ({ ...prev, state, city: "" }));
  };

  const handleCitySelect = (city) => {
    setFormData((prev) => ({ ...prev, city }));
  };

  const handleCategoryToggle = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      businessCategories: prev.businessCategories.includes(categoryId)
        ? prev.businessCategories.filter((id) => id !== categoryId)
        : [...prev.businessCategories, categoryId],
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Update user profile with onboarding data
      const updatedProfile = await apiClient.users.update(user.uid, {
        ...formData,
        profileCompleted: true,
      });

      // Update auth context with completed profile
      updateUserProfile(updatedProfile);

      toast.success("Profile setup completed successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast.error("Failed to complete profile setup. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.role !== "";
      case 2:
        return formData.state !== "" && formData.city !== "";
      case 3:
        return formData.businessCategories.length > 0;
      default:
        return false;
    }
  };

  const stepTitles = {
    1: "Role Selection",
    2: "Location Details",
    3: "Business Categories",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      {/* Header */}
      <header className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Logo />

          {/* Progress Indicator */}
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium text-gray-600">
              Step {currentStep} of {totalSteps}
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-primary-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all ${
                    step <= currentStep
                      ? "bg-primary-500 text-white shadow-lg"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-12 h-1 mx-2 rounded-full transition-all ${
                      step < currentStep ? "bg-primary-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step Title */}
          <div className="text-center mb-8">
            <h1 className="text-sm font-medium text-primary-600 uppercase tracking-wide">
              {stepTitles[currentStep]}
            </h1>
          </div>

          {/* Step Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <RoleSelection
                selectedRole={formData.role}
                onRoleSelect={handleRoleSelect}
              />
            )}

            {currentStep === 2 && (
              <LocationSelection
                selectedState={formData.state}
                selectedCity={formData.city}
                onStateSelect={handleStateSelect}
                onCitySelect={handleCitySelect}
              />
            )}

            {currentStep === 3 && (
              <CategorySelection
                selectedCategories={formData.businessCategories}
                onCategoryToggle={handleCategoryToggle}
              />
            )}
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12">
            <Button
              onClick={handleBack}
              variant="ghost"
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed()}
                loading={isSubmitting}
                className="flex items-center space-x-2"
              >
                <span>Complete Setup</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnboardingFlow;
