import { signInWithPopup } from "firebase/auth";
import { motion } from "framer-motion";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Button from "../../../components/Button";
import Logo from "../../../components/Logo";
import { auth, googleProvider } from "../../../firebaseConfig";

const Register = ({ onSuccess, onSwitchToLogin }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState("choose");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Simulate OTP send/verify
  const handleSendOtp = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setIsLoading(false);
      toast.success("OTP sent to your mobile number!");
    }, 1000);
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setTimeout(() => {
      toast.success("Mobile verified! Redirecting to onboarding...");
      onSuccess?.({ mobile });
      setIsLoading(false);
    }, 1000);
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast.success("Successfully registered with Google!");
      onSuccess?.(result.user);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="text-center mb-8">
        <Logo size="lg" className="justify-center mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Create Account
        </h2>
        <p className="text-gray-600">Join Aarath and transform your business</p>
      </div>

      {step === "choose" && (
        <div className="space-y-6">
          <Button
            type="button"
            className="w-full"
            size="lg"
            onClick={() => navigate("/onboarding")}
          >
            Sign up with WhatsApp / Mobile
          </Button>
          {/* <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleGoogleRegister}
            loading={isLoading}
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5 mr-3"
            />
            Continue with Google
          </Button> */}
        </div>
      )}

      {step === "mobile" && (
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <label className="block text-sm font-medium text-gray-700">
            Mobile Number
          </label>
          <input
            className="w-full border rounded px-3 py-2"
            type="tel"
            placeholder="Enter your mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            disabled={otpSent}
            required
          />
          {!otpSent ? (
            <Button
              type="button"
              className="w-full"
              size="lg"
              loading={isLoading}
              onClick={handleSendOtp}
            >
              Send OTP
            </Button>
          ) : (
            <>
              <label className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                className="w-full border rounded px-3 py-2"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <Button
                type="button"
                className="w-full"
                size="lg"
                loading={isLoading}
                onClick={handleVerifyOtp}
              >
                Verify & Continue
              </Button>
            </>
          )}
          <div className="text-center mt-4">
            <button
              type="button"
              className="text-primary-600 font-medium hover:text-primary-700"
              onClick={() => setStep("choose")}
            >
              Back
            </button>
          </div>
        </form>
      )}

      {/* Switch to Login */}
      <div className="text-center mt-8">
        <p className="text-gray-600">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-primary-600 font-medium hover:text-primary-700"
          >
            Sign in here
          </button>
        </p>
      </div>
      <div className="text-center mt-4">
        <p className="text-xs text-gray-500">
          By creating an account, you agree to our{" "}
          <a href="#" className="text-primary-600 underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary-600 underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;
