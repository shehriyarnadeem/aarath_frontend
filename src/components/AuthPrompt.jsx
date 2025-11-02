import React from "react";
import { LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const AuthPrompt = ({
  action = "perform this action",
  message,
  showRegister = true,
  className = "",
}) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    const returnTo = encodeURIComponent(
      window.location.pathname + window.location.search
    );
    navigate(`/auth/login?returnTo=${returnTo}`);
  };

  const handleRegister = () => {
    const returnTo = encodeURIComponent(
      window.location.pathname + window.location.search
    );
    navigate(`/auth/register?returnTo=${returnTo}`);
  };

  return (
    <div
      className={`bg-gray-50 border border-gray-200 rounded-lg p-6 text-center ${className}`}
    >
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <LogIn className="w-8 h-8 text-green-600" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Sign in Required
      </h3>

      <p className="text-gray-600 mb-6">
        {message || `You need to sign in to ${action}.`}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={handleLogin}
          variant="outline"
          className="flex items-center justify-center"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Sign In
        </Button>

        {showRegister && (
          <Button
            onClick={handleRegister}
            className="flex items-center justify-center bg-green-600 text-white hover:bg-green-700"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Create Account
          </Button>
        )}
      </div>
    </div>
  );
};

export default AuthPrompt;
