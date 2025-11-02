import { useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Custom hook to handle navigation blocking when in auction room
 * @param {boolean} shouldBlock - Whether to block navigation
 * @param {function} onBlocked - Callback when navigation is blocked
 */
export const useNavigationBlock = (shouldBlock, onBlocked) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Block browser back/forward/refresh
  useEffect(() => {
    if (!shouldBlock) return;

    const handleBeforeUnload = (e) => {
      const message =
        "You are about to leave the auction room. If you have active bids and win, you will be notified.";
      e.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldBlock]);

  // Block programmatic navigation
  const blockedNavigate = useCallback(
    (to, options = {}) => {
      if (shouldBlock && location.pathname.includes("/auction")) {
        // Call the blocked callback instead of navigating
        if (onBlocked) {
          onBlocked(to, options);
        }
      } else {
        navigate(to, options);
      }
    },
    [shouldBlock, location.pathname, onBlocked, navigate]
  );

  return blockedNavigate;
};

/**
 * Hook to create a navigation interceptor context
 */
export const useNavigationInterceptor = () => {
  const navigate = useNavigate();

  const createInterceptedNavigate = (interceptor) => {
    return (to, options = {}) => {
      if (interceptor && !interceptor(to, options)) {
        // Navigation was intercepted/blocked
        return;
      }
      navigate(to, options);
    };
  };

  return { createInterceptedNavigate, originalNavigate: navigate };
};
