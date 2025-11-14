import React, { createContext, useContext, useState } from "react";

const NavigationContext = createContext();

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error(
      "useNavigationContext must be used within NavigationProvider"
    );
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [navigationInterceptor, setNavigationInterceptor] = useState(null);
  const [showAuctionExitModal, setShowAuctionExitModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  const interceptNavigation = (targetPath, options = {}) => {
    const currentPath = window.location.pathname;

    // If user is in auction room and trying to navigate away
    if (currentPath.includes("/auctions") && currentPath !== targetPath) {
      // Store the intended navigation target
      setPendingNavigation({ path: targetPath, options });
      // Show auction exit modal
      setShowAuctionExitModal(true);
      // Block navigation
      return false;
    }

    // For other routes, use custom interceptor if available
    if (navigationInterceptor) {
      return navigationInterceptor(targetPath, options);
    }

    return true; // Allow navigation
  };

  const setInterceptor = (interceptor) => {
    setNavigationInterceptor(interceptor);
  };

  const clearInterceptor = () => {
    setNavigationInterceptor(null);
  };

  const handleAuctionExitConfirm = (navigate) => {
    setShowAuctionExitModal(false);
    // Always redirect to "/" regardless of intended destination
    window.location.href = "/";
    setPendingNavigation(null);
  };

  const handleAuctionExitCancel = () => {
    setShowAuctionExitModal(false);
    setPendingNavigation(null);
  };

  return (
    <NavigationContext.Provider
      value={{
        interceptNavigation,
        setInterceptor,
        clearInterceptor,
        // Auction exit modal state and handlers
        showAuctionExitModal,
        handleAuctionExitConfirm,
        handleAuctionExitCancel,
        pendingNavigation,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
