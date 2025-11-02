import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useNavigationContext } from "../../../context/NavigationContext";
import AuctionRoom from "../pages/AuctionRoom";
import AuctionTermsModal from "../components/AuctionTermsModal";
import AuctionExitModal from "../components/AuctionExitModal";

const AuctionRoomWrapper = () => {
  const [showTerms, setShowTerms] = useState(true);
  const [showExitModal, setShowExitModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setInterceptor, clearInterceptor } = useNavigationContext();

  // Handle terms acceptance
  const handleAcceptTerms = () => {
    setTermsAccepted(true);
    setShowTerms(false);
    // DO NOT store in localStorage - force acceptance every time
  };

  // Handle terms decline
  const handleDeclineTerms = () => {
    navigate("/dashboard");
  };

  // Handle navigation away from auction room
  const handleBeforeUnload = useCallback(
    (e) => {
      if (termsAccepted) {
        const message =
          "You are about to leave the auction room. If you have active bids and win, you will be notified.";
        e.returnValue = message;
        return message;
      }
    },
    [termsAccepted]
  );

  // Always show terms on entry - no localStorage check
  // Add beforeunload listener when terms are accepted
  useEffect(() => {
    if (termsAccepted) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [termsAccepted, handleBeforeUnload]);

  // Browser back/forward navigation is now handled by the AuctionRoom component

  // Navigation interceptor is now handled by the AuctionRoom component

  // Handle route navigation (when user clicks other nav items)
  const handleNavigationAttempt = (path) => {
    if (termsAccepted) {
      setPendingNavigation(path);
      setShowExitModal(true);
      return false; // Block navigation
    }
    return true; // Allow navigation if terms not accepted yet
  };

  // Confirm exit from auction room
  const handleConfirmExit = () => {
    setShowExitModal(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
    } else {
      navigate("/dashboard");
    }
  };

  // Cancel exit (stay in auction room)
  const handleCancelExit = () => {
    setShowExitModal(false);
    setPendingNavigation(null);
  };

  // If terms not accepted, show terms modal
  if (showTerms) {
    return (
      <AuctionTermsModal
        isOpen={showTerms}
        onAccept={handleAcceptTerms}
        onDecline={handleDeclineTerms}
      />
    );
  }

  // If terms accepted, show auction room with exit modal overlay
  return (
    <>
      <AuctionRoom onNavigateAway={handleNavigationAttempt} />
      <AuctionExitModal
        isOpen={showExitModal}
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
        activeBids={0} // TODO: Calculate actual active bids from auction room state
      />
    </>
  );
};

export default AuctionRoomWrapper;
