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
  const [navigationBlocked, setNavigationBlocked] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const interceptNavigation = (targetPath, options = {}) => {
    const currentPath = window.location.pathname;

    // If user is in auction room and trying to navigate away
    if (currentPath.includes("/auctions") && currentPath !== targetPath) {
      setNavigationBlocked(true);
      return false;
    }

    return true; // Allow navigation
  };

  return (
    <NavigationContext.Provider
      value={{
        interceptNavigation,
        navigationBlocked,
        currentPath,
        // Auction exit modal state and handlers
        pendingNavigation,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
