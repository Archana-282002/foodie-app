import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addComplaint } from "@/store/foodieSlice";
import { 
  X, 
  Bike, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle 
} from "lucide-react";

export default function OrderTrackerModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.foodie);
  const [complaintText, setComplaintText] = useState("");
  const [showComplaintBox, setShowComplaintBox] = useState(false);
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);

  const activeOrder = orders[0];

  if (!isOpen || !activeOrder) return null;

  const STATUS_STEPS = [
    { key: "PLACED", label: "Order Placed", desc: "Received by restaurant" },
    { key: "ACCEPTED", label: "Accepted", desc: "Kitchen confirmed order" },
    { key: "PREPARING", label: "Preparing", desc: "Chef is cooking your meal" },
    { key: "READY_FOR_PICKUP", label: "Ready", desc: "Food packed for pickup" },
    { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", desc: "Rider on the way" },
    { key: "DELIVERED", label: "Delivered", desc: "Verified with OTP" }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case "PLACED": return 0;
      case "ACCEPTED": return 1;
      case "PREPARING": return 2;
      case "READY_FOR_PICKUP": return 3;
      case "DELIVERY_PARTNER_ASSIGNED":
      case "PICKED_UP":
      case "OUT_FOR_DELIVERY": return 4;
      case "DELIVERED": return 5;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(activeOrder.orderStatus);

  const handleSubmitComplaint = () => {
    if (!complaintText.trim()) return;

    dispatch(addComplaint({
      complaintId: `CMP-${Date.now()}`,
      orderId: activeOrder.orderId,
      customerId: activeOrder.customerId,
      restaurantId: activeOrder.restaurantId,
      complaintType: "DELIVERY_DELAY",
      description: complaintText,
      status: "SUBMITTED",
      refundAmount: 0,
      createdAt: new Date().toISOString()
    }));

    setComplaintSubmitted(true);
    setComplaintText("");
    setTimeout(() => {
      setComplaintSubmitted(false);
      setShowComplaintBox(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] border border-orange-100 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header (Orange Themed) */}
        <div className="p-4 bg-linear-to-r from-orange-500 to-amber-500 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-orange-100">#{activeOrder.orderId}</span>
              <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold uppercase">
                {activeOrder.orderStatus.replace(/_/g, " ")}
              </span>
            </div>
            <h3 className="font-bold text-sm text-white">{activeOrder.restaurantName}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          
          {/* OTP Section (Warm Golden Orange) */}
          <div className="p-4 rounded-2xl bg-orange-50 border-2 border-orange-300 text-center shadow-xs">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white shadow-2xs text-orange-800 font-bold text-xs mb-2 border border-orange-200">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span>Delivery Verification Code</span>
            </div>
            <p className="text-xs text-stone-700 mb-2">
              Share this 4-digit OTP with your delivery partner to confirm handover:
            </p>
            <div className="text-3xl font-black font-mono tracking-widest text-orange-600 bg-white py-2 px-6 rounded-xl inline-block shadow-inner border border-orange-200">
              {activeOrder.deliveryOTP || "4821"}
            </div>
            <p className="text-[10px] text-stone-500 mt-2">
              Status will only change to <span className="font-bold text-emerald-600">DELIVERED</span> once verified.
            </p>
          </div>

          {/* Delivery Rider Details */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-900 block leading-tight">{activeOrder.deliveryPartnerName}</span>
                <span className="text-[11px] text-stone-500">Delivery Partner • 4.85 ★</span>
              </div>
            </div>
            <a
              href={`tel:${activeOrder.deliveryPartnerPhone}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 border border-orange-200 text-xs font-bold hover:bg-orange-100 transition"
            >
              <Phone className="w-3.5 h-3.5" /> Call
            </a>
          </div>

          {/* Stepper Timeline */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-4">
              Live Order Progress
            </h4>

            <div className="space-y-4 relative">
              <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-stone-200 -z-0" />

              {STATUS_STEPS.map((step, idx) => {
                const isCompleted = idx <= currentIndex;
                const isCurrent = idx === currentIndex;

                return (
                  <div key={step.key} className="flex items-start gap-3 relative z-10">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                        isCompleted
                          ? "bg-orange-500 text-white shadow-xs"
                          : "bg-stone-100 text-stone-400 border border-stone-200"
                      } ${isCurrent ? "ring-4 ring-orange-100 scale-110" : ""}`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold ${
                            isCompleted ? "text-stone-900" : "text-stone-400"
                          }`}
                        >
                          {step.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-md font-bold animate-pulse">
                            In Progress
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ordered Items Summary */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
            <h5 className="font-bold text-stone-800">Items in this order:</h5>
            {activeOrder.orderedItems.map((item, idx) => (
              <div key={idx} className="flex justify-between text-stone-600">
                <span>{item.quantity}x {item.name}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-stone-200 flex justify-between font-black text-stone-900">
              <span>Total Paid</span>
              <span>₹{activeOrder.totalAmount}</span>
            </div>
          </div>

          {/* Complaint / Dispute Section (Warm Amber/Stone, no red) */}
          <div className="pt-2">
            {!showComplaintBox ? (
              <button
                onClick={() => setShowComplaintBox(true)}
                className="text-xs text-stone-500 hover:text-orange-600 flex items-center gap-1 font-medium transition"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Need help or report an issue with this order?
              </button>
            ) : (
              <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200 text-xs space-y-2">
                <span className="font-bold text-orange-950 block">Report issue to Admin</span>
                <textarea
                  rows={2}
                  placeholder="Describe your issue (e.g. food delayed, wrong packaging, missing item)..."
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  className="w-full p-2 rounded-lg border border-orange-200 bg-white text-xs"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowComplaintBox(false)}
                    className="px-3 py-1 rounded-lg text-stone-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitComplaint}
                    className="px-3.5 py-1.5 rounded-lg bg-orange-500 text-white font-bold hover:bg-orange-600 transition shadow-xs"
                  >
                    {complaintSubmitted ? "Submitted!" : "Send to Admin"}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
