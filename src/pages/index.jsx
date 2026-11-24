import React, { useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "@/components/Navbar";
import CustomerView from "@/components/CustomerView";
import VendorView from "@/components/VendorView";
import RiderView from "@/components/RiderView";
import AdminView from "@/components/AdminView";
import CartDrawer from "@/components/CartDrawer";
import AiAssistantModal from "@/components/AiAssistantModal";
import TrainOrderModal from "@/components/TrainOrderModal";
import GroupOrderModal from "@/components/GroupOrderModal";
import OrderTrackerModal from "@/components/OrderTrackerModal";

export default function DefaultPage() {
  const { activeRole } = useSelector((state) => state.foodie);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isTrainOpen, setIsTrainOpen] = useState(false);
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-orange-500 selection:text-white pb-16">
      
      {/* Global Responsive Navbar */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAi={() => setIsAiOpen(true)}
        onOpenTrain={() => setIsTrainOpen(true)}
        onOpenGroup={() => setIsGroupOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
      />

      {/* Main Dynamic View based on Active Role */}
      <main className="transition-all duration-300">
        {activeRole === "CUSTOMER" && (
          <CustomerView
            onOpenAi={() => setIsAiOpen(true)}
            onOpenTrain={() => setIsTrainOpen(true)}
            onOpenGroup={() => setIsGroupOpen(true)}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {activeRole === "VENDOR" && <VendorView />}

        {activeRole === "RIDER" && <RiderView />}

        {activeRole === "ADMIN" && <AdminView />}
      </main>

      {/* Reusable Global Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderPlaced={() => setIsTrackerOpen(true)}
      />

      <AiAssistantModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
      />

      <TrainOrderModal
        isOpen={isTrainOpen}
        onClose={() => setIsTrainOpen(false)}
      />

      <GroupOrderModal
        isOpen={isGroupOpen}
        onClose={() => setIsGroupOpen(false)}
      />

      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />

    </div>
  );
}
