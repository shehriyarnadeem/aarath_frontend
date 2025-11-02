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

  const interceptNavigation = (path, options = {}) => {
    if (navigationInterceptor) {
      return navigationInterceptor(path, options);
    }
    return true; // Allow navigation if no interceptor
  };

  const setInterceptor = (interceptor) => {
    setNavigationInterceptor(interceptor); // ✅ Store the function directly
  };

  const clearInterceptor = () => {
    setNavigationInterceptor(null);
  };

  return (
    <NavigationContext.Provider
      value={{
        interceptNavigation,
        setInterceptor,
        clearInterceptor,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
