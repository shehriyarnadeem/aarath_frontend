import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebaseConfig";
import { API_BASE_URL } from "../../../utils/helpers";
import { signInWithCustomToken } from "firebase/auth";

import { apiClient } from "../../../api/client";
import Button from "../../../components/Button";
import Logo from "../../../components/Logo";
import { useAuth } from "../../../context/AuthContext";
import LocationSelection from "../components/LocationSelection";
import RoleSelection from "../components/RoleSelection";
import WhatsappVerification from "../components/WhatsappVerification";
import ProfileCompletionForm from "../components/ProfileCompletionForm";
import CategorySelection from "../components/CategorySelection";

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuth();

  // Form data
  const [formData, setFormData] = useState({
    whatsapp: "",
    whatsappVerified: false,
    role: "",
    state: "",
    city: "",
    code: "",
    businessCategories: [],
    profileCompletion: { businessName: "", email: "" },
  });

  const totalSteps = 5;
  const progressPercentage = (currentStep / totalSteps) * 100;

  // Initialize email from Firebase user when component mounts
  useEffect(() => {
    if (user?.email && !formData.profileCompletion.email) {
      setFormData((prev) => ({
        ...prev,
        profileCompletion: {
          ...prev.profileCompletion,
          email: user.email,
        },
      }));
    }
  }, [user?.email, formData.profileCompletion.email]);

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

  const handleWhatsappChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      whatsapp: value,
      whatsappVerified: false,
    }));
  };

  // Phone number validation helper
  const isValidPhoneNumber = (number) => {
    // Accepts +countrycode and 7-15 digits (e.g. +923001234567)
    return /^\+\d{7,15}$/.test(number);
  };

  // Update handleWhatsappVerify to validate before request
  const handleWhatsappVerify = async () => {
    if (!isValidPhoneNumber(formData.whatsapp)) {
      toast.error(
        "Please enter a valid phone number in international format (e.g. +923001234567)"
      );
      return;
    }
    setVerificationLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/otp/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsapp: formData.whatsapp }),
      });
      const result = await response.json();
      if (result.success) {
        setOtpStep(true);
        toast.success(result.message || "OTP sent to your WhatsApp number.");
      } else {
        toast.error(result.error || "WhatsApp number already exists");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    setOtpLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/otp/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: formData.whatsapp,
          code: otp,
        }),
      });
      const result = await response.json();
      if (result.success) {
        // Only mark WhatsApp as verified, do NOT sign in to Firebase here
        setFormData((prev) => ({ ...prev, whatsappVerified: true }));
        setOtpStep(false);
        toast.success("OTP verified!");
      } else {
        setFormData((prev) => ({ ...prev, whatsappVerified: false }));
        toast.error(result.error || "Invalid OTP");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleProfileCompletionChange = (data) => {
    setFormData((prev) => ({ ...prev, profileCompletion: data }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Prepare data for backend
      const payload = {
        whatsapp: formData.whatsapp,
        state: formData.state,
        city: formData.city,
        role: formData.role,
        businessName: formData.profileCompletion.businessName,
        email: formData.profileCompletion.email,
        businessCategories: formData.businessCategories,
        profileCompleted: true,
      };
      const response = await apiClient.users.onboardingComplete(payload);
      if (response && response.token) {
        await signInWithCustomToken(auth, response.token); // Refresh session
        updateUserProfile(response.user);
        toast.success("Profile setup completed successfully!");
        navigate("/dashboard");
      } else if (response?.error?.includes("already exists")) {
        toast.success("Account already exists. Logging you in...");
        navigate("/dashboard");
      } else {
        throw new Error(response?.error || "Failed to create user and session");
      }
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
        return formData.whatsapp && formData.whatsappVerified;
      case 2:
        return formData.state !== "" && formData.city !== "";
      case 3:
        return !!formData.role;
      case 4:
        return (
          !!formData.profileCompletion.businessName &&
          !!formData.profileCompletion.email
        );
      case 5:
        return formData.businessCategories.length > 0;
      default:
        return false;
    }
  };

  const stepTitles = {
    1: "Phone Verfication",
    2: "Location Details",
    3: "Role Selection",
    4: "Profile Completion",
    5: "Business Categories",
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
            {[1, 2, 3, 4, 5].map((step) => (
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
                {step < 5 && (
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
              <>
                <WhatsappVerification
                  value={formData.whatsapp}
                  onChange={handleWhatsappChange}
                  onVerify={handleWhatsappVerify}
                  verified={formData.whatsappVerified}
                  loading={verificationLoading}
                />
                {otpStep && !formData.whatsappVerified && (
                  <div className="mt-6 space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Enter OTP
                    </label>
                    <input
                      className="w-30 border rounded px-3 py-2 tracking-widest text-center"
                      type="text"
                      maxLength={6}
                      placeholder="6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      style={{
                        letterSpacing: "0.5em",
                        fontSize: "1rem",
                        textAlign: "center",
                        border: "2px solid white",
                        borderRadius: "0.5rem",

                        outline: "none",
                        boxShadow: "0 0 0 2px #bbf7d0",
                      }}
                    />
                    <Button
                      onClick={handleOtpVerify}
                      loading={otpLoading}
                      className="w-30 mx-10"
                    >
                      Verify OTP
                    </Button>
                  </div>
                )}
              </>
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
              <RoleSelection
                selectedRole={formData.role}
                onRoleSelect={handleRoleSelect}
              />
            )}

            {currentStep === 4 && (
              <ProfileCompletionForm
                data={formData.profileCompletion}
                onChange={handleProfileCompletionChange}
                whatsapp={formData.whatsapp}
                state={formData.state}
                city={formData.city}
              />
            )}

            {currentStep === 5 && (
              <CategorySelection
                selectedCategories={formData.businessCategories}
                onCategoryToggle={(categoryId) => {
                  setFormData((prev) => ({
                    ...prev,
                    businessCategories: prev.businessCategories.includes(
                      categoryId
                    )
                      ? prev.businessCategories.filter(
                          (id) => id !== categoryId
                        )
                      : [...prev.businessCategories, categoryId],
                  }));
                }}
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
