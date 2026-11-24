import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateRestaurantStatus, updateOrderStatus, toggleMenuItemAvailability } from "@/store/foodieSlice";
import { 
  UtensilsCrossed, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Power, 
  CloudRain, 
  Wrench, 
  Flame, 
  ChefHat, 
  Bike,
  ShieldAlert,
  ToggleLeft,
  ToggleRight
} from "lucide-react";

export default function VendorView() {
  const dispatch = useDispatch();
  const { restaurants, menuItems, orders } = useSelector((state) => state.foodie);

  const [selectedRestId, setSelectedRestId] = useState("rest-001");
  const [closureReasonInput, setClosureReasonInput] = useState("Temporarily closed due to heavy rain & waterlogging");
  const [reopenTimeInput, setReopenTimeInput] = useState("2026-11-24T15:30:00Z");

  const currentRestaurant = restaurants.find((r) => r.restaurantId === selectedRestId) || restaurants[0];
  const restaurantMenuItems = menuItems.filter((i) => i.restaurantId === selectedRestId);
  const restaurantOrders = orders.filter((o) => o.restaurantId === selectedRestId);

  const handleStatusChange = (newStatus) => {
    dispatch(updateRestaurantStatus({
      restaurantId: selectedRestId,
      availabilityStatus: newStatus,
      closureReason: newStatus === "TEMPORARILY_CLOSED" ? closureReasonInput : "",
      expectedReopeningTime: newStatus === "TEMPORARILY_CLOSED" ? reopenTimeInput : ""
    }));
  };

  const handleNextStatus = (order) => {
    let nextStatus = "";
    if (order.orderStatus === "PLACED") nextStatus = "ACCEPTED";
    else if (order.orderStatus === "ACCEPTED") nextStatus = "PREPARING";
    else if (order.orderStatus === "PREPARING") nextStatus = "READY_FOR_PICKUP";

    if (nextStatus) {
      dispatch(updateOrderStatus({
        orderId: order.orderId,
        status: nextStatus
      }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Vendor Top Bar */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-orange-600 via-amber-600 to-stone-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <UtensilsCrossed className="w-7 h-7 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black">{currentRestaurant.name}</h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                currentRestaurant.availabilityStatus === "OPEN"
                  ? "bg-emerald-500 text-white"
                  : currentRestaurant.availabilityStatus === "BUSY"
                    ? "bg-amber-500 text-white"
                    : "bg-stone-800 text-white border border-stone-600"
              }`}>
                {currentRestaurant.availabilityStatus.replace(/_/g, " ")}
              </span>
            </div>
            <p className="text-xs text-orange-100">
              Vendor Portal • {currentRestaurant.cuisine} • Avg Prep Time: {currentRestaurant.avgPrepTimeMinutes} mins
            </p>
          </div>
        </div>

        {/* Restaurant Selector */}
        <div className="flex items-center gap-2 bg-white/10 p-2 rounded-2xl border border-white/15">
          <span className="text-xs font-semibold text-orange-100">Switch Kitchen:</span>
          <select
            value={selectedRestId}
            onChange={(e) => setSelectedRestId(e.target.value)}
            className="text-xs font-bold bg-white text-stone-900 px-3 py-1.5 rounded-xl focus:outline-none"
          >
            {restaurants.map((r) => (
              <option key={r.restaurantId} value={r.restaurantId}>
                {r.name} ({r.availabilityStatus})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Signature Feature: Smart Restaurant Availability & Temporary Closure Control */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Power className="w-5 h-5 text-orange-500" />
            <h2 className="text-base font-extrabold text-stone-900">
              Kitchen Operating Status & Smart Temporary Closure
            </h2>
          </div>
          <span className="text-xs text-stone-500 hidden sm:inline">Controls customer ordering in real time</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* OPEN */}
          <button
            onClick={() => handleStatusChange("OPEN")}
            className={`p-4 rounded-2xl border text-left transition ${
              currentRestaurant.availabilityStatus === "OPEN"
                ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200"
                : "bg-stone-50 border-stone-200 hover:bg-stone-100"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-emerald-900">🟢 Open & Accepting Orders</span>
              {currentRestaurant.availabilityStatus === "OPEN" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            </div>
            <p className="text-[11px] text-stone-500">Normal kitchen operations, full delivery active.</p>
          </button>

          {/* BUSY */}
          <button
            onClick={() => handleStatusChange("BUSY")}
            className={`p-4 rounded-2xl border text-left transition ${
              currentRestaurant.availabilityStatus === "BUSY"
                ? "bg-amber-50 border-amber-500 ring-2 ring-amber-200"
                : "bg-stone-50 border-stone-200 hover:bg-stone-100"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-amber-900">🟡 Kitchen Busy (+20 min delay)</span>
              {currentRestaurant.availabilityStatus === "BUSY" && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
            </div>
            <p className="text-[11px] text-stone-500">Warns customers of preparation delay before placing.</p>
          </button>

          {/* TEMPORARILY CLOSED */}
          <button
            onClick={() => handleStatusChange("TEMPORARILY_CLOSED")}
            className={`p-4 rounded-2xl border text-left transition ${
              currentRestaurant.availabilityStatus === "TEMPORARILY_CLOSED"
                ? "bg-stone-100 border-stone-500 ring-2 ring-stone-300"
                : "bg-stone-50 border-stone-200 hover:bg-stone-100"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-stone-900">⚫ Temporarily Closed (Stop Orders)</span>
              {currentRestaurant.availabilityStatus === "TEMPORARILY_CLOSED" && <AlertTriangle className="w-4 h-4 text-stone-700" />}
            </div>
            <p className="text-[11px] text-stone-500">Auto-stops new orders with custom customer notification.</p>
          </button>
        </div>

        {/* If Temporarily Closed: Configure Closure Reason */}
        {currentRestaurant.availabilityStatus === "TEMPORARILY_CLOSED" && (
          <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-3 animate-in fade-in duration-200">
            <span className="text-xs font-bold text-orange-950 block">Configure Temporary Closure Notification:</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Pre-set Closure Reason</label>
                <select
                  value={closureReasonInput}
                  onChange={(e) => {
                    setClosureReasonInput(e.target.value);
                    dispatch(updateRestaurantStatus({
                      restaurantId: selectedRestId,
                      availabilityStatus: "TEMPORARILY_CLOSED",
                      closureReason: e.target.value,
                      expectedReopeningTime: reopenTimeInput
                    }));
                  }}
                  className="w-full text-xs font-medium p-2.5 rounded-xl border border-orange-200 bg-white"
                >
                  <option value="Temporarily closed due to heavy rain & waterlogging">🌧️ Heavy Rain / Monsoon Flooding</option>
                  <option value="Kitchen maintenance & deep cleaning in progress">🔧 Kitchen Maintenance & Cleaning</option>
                  <option value="Temporary electrical power outage">⚡ Power Cut / Inverter Issue</option>
                  <option value="Ingredient restock in progress">🥩 Ingredient Restock</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Expected Reopening Time</label>
                <input
                  type="text"
                  value="Expected Reopening: Today at 2:30 PM (or manual reopen)"
                  readOnly
                  className="w-full text-xs font-medium p-2.5 rounded-xl border border-orange-200 bg-white text-stone-700"
                />
              </div>
            </div>

            <p className="text-[11px] text-orange-900">
              📢 <strong>Customer Impact:</strong> Customers viewing your restaurant will see this warning, new orders are blocked, and nearby open restaurants are suggested.
            </p>
          </div>
        )}
      </div>

      {/* Live Orders & Kitchen Prep Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-orange-500" />
            <span>Kitchen Order Queue ({restaurantOrders.length})</span>
          </h2>
        </div>

        {restaurantOrders.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-stone-200">
            <p className="text-xs text-stone-500">No active orders right now. New customer orders will appear here instantly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {restaurantOrders.map((order) => (
              <div
                key={order.orderId}
                className="p-5 rounded-3xl border border-stone-200 bg-white shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div>
                    <span className="text-xs font-mono font-bold text-orange-600 block">#{order.orderId}</span>
                    <span className="text-xs font-bold text-stone-900">{order.customerName} ({order.customerPhone})</span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    order.orderStatus === "DELIVERED"
                      ? "bg-emerald-100 text-emerald-800"
                      : order.orderStatus === "OUT_FOR_DELIVERY"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-amber-100 text-amber-800 animate-pulse"
                  }`}>
                    {order.orderStatus.replace(/_/g, " ")}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-1.5 text-xs">
                  {order.orderedItems.map((item, i) => (
                    <div key={i} className="flex justify-between font-medium text-stone-700">
                      <span>{item.quantity}x {item.name}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-stone-100 flex justify-between font-black text-stone-900">
                    <span>Total Amount</span>
                    <span>₹{order.totalAmount}</span>
                  </div>
                </div>

                {/* Rider Info */}
                <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-orange-50/50 text-stone-600">
                  <div className="flex items-center gap-2">
                    <Bike className="w-4 h-4 text-orange-600" />
                    <span>Assigned Rider: <strong className="text-stone-900">{order.deliveryPartnerName}</strong></span>
                  </div>
                  <span className="text-[10px] text-stone-400">OTP Handover Required</span>
                </div>

                {/* Action Buttons */}
                <div className="pt-1">
                  {order.orderStatus === "PLACED" && (
                    <button
                      onClick={() => handleNextStatus(order)}
                      className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition"
                    >
                      Accept Order
                    </button>
                  )}
                  {order.orderStatus === "ACCEPTED" && (
                    <button
                      onClick={() => handleNextStatus(order)}
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition"
                    >
                      Start Cooking (Move to Preparing)
                    </button>
                  )}
                  {order.orderStatus === "PREPARING" && (
                    <button
                      onClick={() => handleNextStatus(order)}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
                    >
                      Food Ready for Pickup
                    </button>
                  )}
                  {order.orderStatus === "READY_FOR_PICKUP" && (
                    <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 text-xs text-center font-bold">
                      Waiting for Rider to collect packed meal
                    </div>
                  )}
                  {(order.orderStatus === "OUT_FOR_DELIVERY" || order.orderStatus === "PICKED_UP") && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs text-center font-bold">
                      Rider is Out for Delivery to Customer
                    </div>
                  )}
                  {order.orderStatus === "DELIVERED" && (
                    <div className="p-2.5 rounded-xl bg-stone-100 text-stone-700 text-xs text-center font-bold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Order Completed & Delivered with OTP</span>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Menu Management (In-stock / Out-of-Stock) */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
        <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          <span>Menu Inventory & Dish Availability</span>
        </h2>

        <div className="divide-y divide-stone-100">
          {restaurantMenuItems.map((item) => (
            <div key={item.itemId} className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-stone-900 block">{item.name}</span>
                <span className="text-[11px] text-stone-500">{item.category} • ₹{item.price} • {item.spiceLevel}</span>
              </div>

              <button
                onClick={() => dispatch(toggleMenuItemAvailability({ itemId: item.itemId }))}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  item.isAvailable === "true"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-stone-100 text-stone-700 border border-stone-200"
                }`}
              >
                <span>{item.isAvailable === "true" ? "In Stock" : "Sold Out"}</span>
                {item.isAvailable === "true" ? (
                  <ToggleRight className="w-5 h-5 text-emerald-600" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-stone-500" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
