import { signInWithPopup, getAuth, signInWithCustomToken } from "firebase/auth";
import { motion } from "framer-motion";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Button from "../../../components/Button";
import Logo from "../../../components/Logo";
import { auth, googleProvider } from "../../../firebaseConfig";

const API_BASE_URL = "http://localhost:5000";

const Login = ({ onSuccess, onSwitchToRegister }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState("choose");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");

  // Send OTP using backend
  const handleSendOtp = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/otp/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setOtpSent(true);
        setIsLoading(false);
        setError("");
        toast.success("OTP sent to your mobile number!");
      } else {
        setIsLoading(false);
        setError(result.error || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      setIsLoading(false);
      setError("Network error. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/otp/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp }),
      });
      const result = await response.json();
      if (response.ok && result.success && result.token) {
        // Sign in to Firebase with custom token
        const auth = getAuth();
        await signInWithCustomToken(auth, result.token);
        setIsLoading(false);
        setError("");
        toast.success("Successfully logged in!");
        onSuccess?.({ mobile });
      } else {
        setIsLoading(false);
        setError(result.error || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setIsLoading(false);
      setError("Network error. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast.success("Successfully logged in with Google!");
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
      className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <Logo size="lg" className="justify-center mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-600">Sign in to your Aarath account</p>
      </div>

      {step === "choose" && (
        <div className="space-y-6">
          <Button
            type="button"
            className="w-full"
            size="lg"
            onClick={() => setStep("mobile")}
          >
            Login with WhatsApp / Mobile
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleGoogleLogin}
            loading={isLoading}
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5 mr-3"
            />
            Continue with Google
          </Button>
        </div>
      )}

      {step === "mobile" && (
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <label className="block text-sm font-medium text-gray-700">
            Mobile Number (with country code)
          </label>
          <input
            className="w-full border rounded px-3 py-2"
            type="tel"
            placeholder="e.g. +923001234567"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            disabled={otpSent}
            required
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
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
                className="w-full border rounded px-3 py-2 tracking-widest text-center"
                type="text"
                maxLength={6}
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <Button
                type="button"
                className="w-full"
                size="lg"
                loading={isLoading}
                onClick={handleVerifyOtp}
              >
                Verify & Login
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

      <div className="text-center mt-8">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={onSwitchToRegister}
            className="text-primary-600 font-medium hover:text-primary-700"
          >
            Sign up now
          </button>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;
