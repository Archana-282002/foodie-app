import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateOrderStatus, verifyOrderOTP } from "@/store/foodieSlice";
import { 
  Bike, 
  MapPin, 
  Phone, 
  Navigation, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Coins, 
  AlertCircle,
  KeyRound
} from "lucide-react";

export default function RiderView() {
  const dispatch = useDispatch();
  const { riders, orders } = useSelector((state) => state.foodie);

  const currentRider = riders[0]; // Ramesh Kumar
  const [isOnline, setIsOnline] = useState(true);
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [selectedOrderForOtp, setSelectedOrderForOtp] = useState(null);

  // Find active orders assigned to riders
  const activeDelivery = orders.find(
    (o) => o.orderStatus !== "DELIVERED" && o.orderStatus !== "CANCELLED"
  );

  const handleConfirmPickup = (orderId) => {
    dispatch(updateOrderStatus({
      orderId,
      status: "OUT_FOR_DELIVERY"
    }));
  };

  const handleVerifyOtp = () => {
    if (!selectedOrderForOtp) return;
    if (otpInput.trim() !== selectedOrderForOtp.deliveryOTP) {
      setOtpError("Incorrect OTP. Please ask the customer to check their live tracking screen.");
      return;
    }

    setOtpError("");
    dispatch(verifyOrderOTP({
      orderId: selectedOrderForOtp.orderId,
      enteredOtp: otpInput.trim()
    }));

    setShowOtpModal(false);
    setOtpInput("");
    setSelectedOrderForOtp(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Rider Header Card */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-blue-700 via-indigo-700 to-sky-800 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Bike className="w-7 h-7 text-sky-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black">{currentRider.fullName}</h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                isOnline ? "bg-emerald-500 text-white" : "bg-gray-400 text-white"
              }`}>
                {isOnline ? "ONLINE" : "OFFLINE"}
              </span>
            </div>
            <p className="text-xs text-blue-200">
              {currentRider.vehicleType} • Rating: 4.85 ★ • Hub: Banjara Hills, Hyderabad
            </p>
          </div>
        </div>

        {/* Online/Offline Toggle */}
        <div className="flex items-center gap-3 bg-white/10 p-2 rounded-2xl border border-white/15">
          <span className="text-xs font-semibold text-white">Duty Status:</span>
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
              isOnline
                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                : "bg-gray-500 text-white hover:bg-gray-600"
            }`}
          >
            {isOnline ? "🟢 Go Offline" : "⚪ Go Online"}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
            Today's Earnings
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-gray-900">₹{currentRider.totalEarnings}</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">+₹65 per completed OTP trip</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
            Completed Trips
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-gray-900">{currentRider.completedTrips}</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[10px] text-gray-400 font-medium block mt-1">100% On-time delivery rate</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
            Active Assignment
          </span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-900">
              {activeDelivery ? `#${activeDelivery.orderId}` : "Waiting for order"}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[10px] text-orange-600 font-semibold block mt-1">
            {activeDelivery ? activeDelivery.orderStatus.replace(/_/g, " ") : "Idle & Ready"}
          </span>
        </div>
      </div>

      {/* Active Delivery Job Card */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
          <Navigation className="w-5 h-5 text-blue-600" />
          <span>Current Active Trip</span>
        </h2>

        {!activeDelivery ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-gray-100 space-y-2">
            <Bike className="w-10 h-10 text-gray-300 mx-auto" />
            <h4 className="font-bold text-gray-800 text-sm">No active order assigned right now</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Stay online in Banjara Hills. New restaurant orders requiring pickup will be pushed here automatically.
            </p>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-white border border-gray-200/90 shadow-md space-y-6">
            
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 block">Trip ID: #{activeDelivery.orderId}</span>
                <h3 className="text-base font-extrabold text-gray-900">
                  Deliver for {activeDelivery.restaurantName}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                  Payout: ₹65
                </span>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200 uppercase">
                  {activeDelivery.orderStatus.replace(/_/g, " ")}
                </span>
              </div>
            </div>

            {/* Route Timeline (Restaurant -> Customer) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pickup Point */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">
                  1. Pickup Restaurant
                </span>
                <h4 className="text-xs font-bold text-gray-900">{activeDelivery.restaurantName}</h4>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>Road No. 12, Banjara Hills</span>
                </p>
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-gray-700 block mb-1">Items to collect:</span>
                  <ul className="text-xs text-gray-600 list-disc list-inside">
                    {activeDelivery.orderedItems.map((item, i) => (
                      <li key={i}>{item.quantity}x {item.name}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Delivery Point */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                  2. Customer Drop-off
                </span>
                <h4 className="text-xs font-bold text-gray-900">{activeDelivery.customerName}</h4>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{activeDelivery.deliveryAddress}</span>
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <a
                    href={`tel:${activeDelivery.customerPhone}`}
                    className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-800 text-xs font-bold hover:bg-gray-100 transition flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Call Customer</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Rider Action Buttons */}
            <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3">
              {activeDelivery.orderStatus === "READY_FOR_PICKUP" && (
                <button
                  onClick={() => handleConfirmPickup(activeDelivery.orderId)}
                  className="w-full sm:flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Meal Collected & Start Trip</span>
                </button>
              )}

              {activeDelivery.orderStatus === "OUT_FOR_DELIVERY" && (
                <button
                  onClick={() => {
                    setSelectedOrderForOtp(activeDelivery);
                    setShowOtpModal(true);
                  }}
                  className="w-full sm:flex-1 py-3.5 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 animate-bounce-subtle"
                >
                  <KeyRound className="w-4 h-4 text-amber-300" />
                  <span>Arrived at Customer — Verify OTP to Deliver</span>
                </button>
              )}

              {activeDelivery.orderStatus !== "READY_FOR_PICKUP" && activeDelivery.orderStatus !== "OUT_FOR_DELIVERY" && (
                <div className="w-full p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-center font-bold">
                  Kitchen is currently preparing this meal. Waiting for pickup alert...
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && selectedOrderForOtp && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-gray-900 text-base">Enter Customer Delivery OTP</h3>
              <p className="text-xs text-gray-500">
                Ask {selectedOrderForOtp.customerName} for the 4-digit code shown on their tracking screen.
              </p>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="4-digit OTP"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                maxLength={4}
                className="w-full text-center text-3xl font-black font-mono tracking-widest py-3 rounded-2xl border-2 border-emerald-500 bg-emerald-50/20 text-gray-900 focus:outline-none"
              />
              {otpError && (
                <p className="text-[11px] text-red-500 text-center font-bold">{otpError}</p>
              )}
              <p className="text-[10px] text-gray-400 text-center">
                (Demo hint: Customer OTP is <strong>{selectedOrderForOtp.deliveryOTP}</strong>)
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setOtpInput("");
                  setOtpError("");
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtp}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-md shadow-emerald-600/20"
              >
                Confirm Delivery
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
