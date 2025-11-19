import React, { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import { useNavigationContext } from "../../../context/NavigationContext";
import AuctionRoom from "../pages/AuctionRoom";
import AuctionTermsModal from "../components/AuctionTermsModal";
import AuctionExitModal from "../components/AuctionExitModal";
import { useAuth } from "../../../context/AuthContext";
const AuctionRoomWrapper = () => {
  const [showTerms, setShowTerms] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showAuctionExitModal, setShowAuctionExitModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { navigationBlocked, currentPath } = useNavigationContext();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (navigationBlocked) {
      // Handle navigation blocked state
      setShowAuctionExitModal(true);
    }
  }, [navigationBlocked]);

  const handleAuctionExitConfirm = () => {
    setShowAuctionExitModal(false);
    // Proceed with navigation away from auction room
    window.location.href = "/";
  };

  const handleAuctionExitCancel = () => {
    setShowAuctionExitModal(false);
  };
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
      <AuctionRoom />
      <AuctionExitModal
        isOpen={showAuctionExitModal}
        onConfirm={handleAuctionExitConfirm}
        onCancel={handleAuctionExitCancel}
        activeBids={0} // TODO: Calculate actual active bids from auction room state
      />
    </>
  );
};

export default AuctionRoomWrapper;
