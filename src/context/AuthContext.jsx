import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

import { apiClient } from "../api/client";
import { auth } from "../firebaseConfig";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsAuthenticated(true);

        try {
          // Fetch user profile from backend
          const profile = await apiClient.users.getById(firebaseUser.uid);
          console.log("Fetched user profile:", profile);
          setUserProfile(profile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // If user doesn't exist in backend, create them or use fallback profile
          try {
            const newProfile = await apiClient.users.create({
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name:
                firebaseUser.displayName || firebaseUser.email?.split("@")[0],
            });
            console.log("Created new user profile:", newProfile);
            setUserProfile(newProfile);
          } catch (createError) {
            console.error("Error creating user profile:", createError);
            // Fallback: create a minimal profile from Firebase user
            const fallbackProfile = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name:
                firebaseUser.displayName ||
                firebaseUser.email?.split("@")[0] ||
                "User",
              businessName: firebaseUser.displayName || "My Business",
            };
            console.log("Using fallback profile:", fallbackProfile);
            setUserProfile(fallbackProfile);
          }
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);

      // Clear local state immediately
      setUser(null);
      setUserProfile(null);
      setIsAuthenticated(false);
      updateUserProfile(null);

      // Clear any local storage if needed
      localStorage.removeItem("userProfile");
      localStorage.removeItem("authToken");

      // User successfully signed out
    } catch (error) {
      console.error("Error signing out:", error);

      // Even if Firebase signout fails, clear local state
      setUser(null);
      setUserProfile(null);
      setIsAuthenticated(false);
      localStorage.removeItem("userProfile");
      localStorage.removeItem("authToken");

      throw error; // Re-throw so AppLayout can handle it
    }
  };

  const updateUserProfile = (updatedProfile) => {
    setUserProfile(updatedProfile);
  };

  const value = {
    user,
    userProfile,
    isAuthenticated,
    loading,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
