import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { resolveComplaint, updateRestaurantStatus } from "@/store/foodieSlice";
import { 
  ShieldCheck, 
  Users, 
  DollarSign, 
  ShoppingBag, 
  Store, 
  Bike, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Clock,
  ArrowUpRight
} from "lucide-react";

export default function AdminView() {
  const dispatch = useDispatch();
  const { restaurants, orders, complaints, riders } = useSelector((state) => state.foodie);

  const [activeTab, setActiveTab] = useState("OVERVIEW"); // OVERVIEW, VENDORS, ORDERS, COMPLAINTS

  const totalGrossSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalCompletedOrders = orders.filter((o) => o.orderStatus === "DELIVERED").length;
  const activeOrdersCount = orders.filter((o) => o.orderStatus !== "DELIVERED" && o.orderStatus !== "CANCELLED").length;

  const handleResolveComplaint = (complaintId, status, refundAmount) => {
    dispatch(resolveComplaint({
      complaintId,
      status,
      refundAmount
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Admin Top Header (Orange & Warm Amber Themed) */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-orange-600 via-amber-600 to-stone-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <ShieldCheck className="w-7 h-7 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black">Foodie Platform Control Hub</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500 text-white uppercase tracking-wider">
                SUPERADMIN
              </span>
            </div>
            <p className="text-xs text-orange-100">
              Manage vendors, live order dispatch, rider payouts, and customer disputes
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-white/10 p-1 rounded-2xl border border-white/15">
          {["OVERVIEW", "VENDORS", "ORDERS", "COMPLAINTS"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === tab
                  ? "bg-white text-orange-950 shadow-xs"
                  : "text-orange-100 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1">
            Gross Sales (GMV)
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-stone-900">₹{totalGrossSales.toFixed(2)}</span>
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">+18.4% vs last week</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1">
            Active Orders
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-orange-600">{activeOrdersCount}</span>
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[10px] text-stone-400 font-medium block mt-1">Live in kitchen or on road</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1">
            Partner Restaurants
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-stone-900">{restaurants.length}</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">100% Verified Partners</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1">
            Active Delivery Riders
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-stone-900">{riders.length}</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Bike className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[10px] text-amber-700 font-bold block mt-1">OTP Verified Deliveries</span>
        </div>
      </div>

      {/* Tab: VENDORS */}
      {activeTab === "VENDORS" && (
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-stone-900">Partner Restaurants & Operating Status</h2>
          
          <div className="divide-y divide-stone-100">
            {restaurants.map((rest) => (
              <div key={rest.restaurantId} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={rest.imageUrl} alt={rest.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-stone-900">{rest.name}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        rest.availabilityStatus === "OPEN"
                          ? "bg-emerald-100 text-emerald-800"
                          : rest.availabilityStatus === "BUSY"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-stone-200 text-stone-800"
                      }`}>
                        {rest.availabilityStatus.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">{rest.cuisine} • {rest.city}</p>
                    {rest.closureReason && (
                      <p className="text-[11px] text-amber-800 font-medium mt-0.5">⚠️ {rest.closureReason}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => dispatch(updateRestaurantStatus({
                      restaurantId: rest.restaurantId,
                      availabilityStatus: rest.availabilityStatus === "OPEN" ? "TEMPORARILY_CLOSED" : "OPEN",
                      closureReason: rest.availabilityStatus === "OPEN" ? "Admin suspended" : ""
                    }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      rest.availabilityStatus === "OPEN"
                        ? "bg-stone-100 text-stone-800 hover:bg-stone-200"
                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    {rest.availabilityStatus === "OPEN" ? "Pause Orders" : "Re-open Restaurant"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: ORDERS */}
      {(activeTab === "ORDERS" || activeTab === "OVERVIEW") && (
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-stone-900">Live Platform Order Dispatch</h2>
            <span className="text-xs text-stone-500">Auto-refreshing in real time</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3 rounded-l-xl">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Restaurant</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Rider</th>
                  <th className="p-3">OTP</th>
                  <th className="p-3 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((o) => (
                  <tr key={o.orderId} className="hover:bg-stone-50/50">
                    <td className="p-3 font-mono font-bold text-orange-600">#{o.orderId}</td>
                    <td className="p-3 font-medium text-stone-900">{o.customerName}</td>
                    <td className="p-3 text-stone-700">{o.restaurantName}</td>
                    <td className="p-3 text-stone-500">{o.orderedItems.length} items</td>
                    <td className="p-3 font-bold text-stone-900">₹{o.totalAmount}</td>
                    <td className="p-3 text-stone-600">{o.deliveryPartnerName}</td>
                    <td className="p-3 font-mono font-bold text-orange-600 bg-orange-50 rounded px-2">
                      {o.deliveryOTP}
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        o.orderStatus === "DELIVERED"
                          ? "bg-emerald-100 text-emerald-800"
                          : o.orderStatus === "OUT_FOR_DELIVERY"
                            ? "bg-orange-100 text-orange-800 animate-pulse"
                            : "bg-amber-100 text-amber-800"
                      }`}>
                        {o.orderStatus.replace(/_/g, " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: COMPLAINTS (Warm Amber/Stone, no red) */}
      {activeTab === "COMPLAINTS" && (
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span>Customer Complaints & Refund Processing</span>
          </h2>

          {complaints.length === 0 ? (
            <div className="p-8 text-center text-stone-400 text-xs">
              No pending complaints. All customer orders are running smoothly!
            </div>
          ) : (
            <div className="space-y-3">
              {complaints.map((c) => (
                <div key={c.complaintId} className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex flex-col md:flex-row justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-orange-700">{c.complaintType}</span>
                      <span className="text-[10px] text-stone-400">Order #{c.orderId}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.status === "REFUND_APPROVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-700 mt-1">{c.description}</p>
                    {c.refundAmount > 0 && (
                      <p className="text-xs font-bold text-emerald-600 mt-1">Refund Amount: ₹{c.refundAmount}</p>
                    )}
                  </div>

                  {c.status === "SUBMITTED" && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleResolveComplaint(c.complaintId, "REFUND_APPROVED", 150)}
                        className="px-3 py-1.5 rounded-xl bg-orange-500 text-white font-bold text-xs hover:bg-orange-600 transition shadow-xs"
                      >
                        Approve ₹150 Refund
                      </button>
                      <button
                        onClick={() => handleResolveComplaint(c.complaintId, "REJECTED", 0)}
                        className="px-3 py-1.5 rounded-xl bg-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-300 transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
