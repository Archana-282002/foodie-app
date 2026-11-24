import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateQuantity, clearCart, applyCoupon, removeCoupon, createOrder } from "@/store/foodieSlice";
import { X, Trash2, Tag, ShoppingBag, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export default function CartDrawer({ isOpen, onClose, onOrderPlaced }) {
  const dispatch = useDispatch();
  const { cart, coupons, user } = useSelector((state) => state.foodie);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [deliveryAddress, setDeliveryAddress] = useState(user.address);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 300 ? 0 : 35;
  const taxAmount = Math.round(subtotal * 0.05 * 10) / 10;

  let discountAmount = 0;
  if (cart.appliedCoupon) {
    if (cart.appliedCoupon.discountType === "PERCENTAGE") {
      discountAmount = Math.min(
        (subtotal * cart.appliedCoupon.discountValue) / 100,
        cart.appliedCoupon.maxDiscountAmount
      );
    } else {
      discountAmount = Math.min(cart.appliedCoupon.discountValue, subtotal);
    }
  }

  const grandTotal = Math.max(0, subtotal + deliveryFee + taxAmount - discountAmount);

  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === code && c.isActive === "true");

    if (!found) {
      setCouponError("Invalid or expired coupon code");
      return;
    }
    if (subtotal < found.minOrderValue) {
      setCouponError(`Minimum order value of ₹${found.minOrderValue} required`);
      return;
    }

    setCouponError("");
    dispatch(applyCoupon(found));
    setCouponInput("");
  };

  const handlePlaceOrder = () => {
    if (cart.items.length === 0) return;
    setIsSubmitting(true);

    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder = {
      orderId,
      customerId: user.userId,
      customerName: user.fullName,
      customerPhone: user.phone,
      restaurantId: cart.restaurantId,
      restaurantName: cart.restaurantName,
      deliveryPartnerId: "rider-001",
      deliveryPartnerName: "Ramesh Kumar",
      deliveryPartnerPhone: "+91 98765 43210",
      orderType: "NORMAL",
      orderedItems: [...cart.items],
      subtotal,
      deliveryFee,
      discountAmount,
      taxAmount,
      totalAmount: grandTotal,
      appliedCouponCode: cart.appliedCoupon ? cart.appliedCoupon.code : "",
      orderStatus: "PLACED",
      deliveryAddress,
      deliveryOTP: randomOtp,
      isOtpVerified: "false",
      paymentStatus: "PAID",
      paymentMethod,
      estimatedDeliveryTime: "30-35 mins",
      createdAt: new Date().toISOString(),
      statusHistory: [
        {
          status: "PLACED",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]
    };

    setTimeout(() => {
      dispatch(createOrder(newOrder));
      setIsSubmitting(false);
      onClose();
      if (onOrderPlaced) onOrderPlaced(newOrder);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-orange-100 flex items-center justify-between bg-orange-50/50">
          <div>
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-orange-500" />
              <span>Your Cart</span>
            </h3>
            {cart.restaurantName && (
              <p className="text-xs text-stone-500 font-medium">Ordering from {cart.restaurantName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {cart.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center text-orange-400 mb-4">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h4 className="text-base font-bold text-stone-800 mb-1">Your cart is empty</h4>
            <p className="text-xs text-stone-500 max-w-xs mb-6">
              Looks like you haven't added anything to your cart yet. Discover hot delicious meals!
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-xs shadow-md shadow-orange-500/20 hover:bg-orange-600 transition"
            >
              Explore Restaurants
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Items List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-500 uppercase tracking-wider">
                <span>Items Ordered ({cart.items.length})</span>
                <button
                  onClick={() => dispatch(clearCart())}
                  className="text-stone-500 hover:text-orange-600 flex items-center gap-1 normal-case font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              </div>

              {cart.items.map((item) => (
                <div key={item.itemId} className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-white shadow-2xs">
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-xs border flex items-center justify-center ${
                      item.isVeg === "true" ? "border-green-600" : "border-amber-800"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        item.isVeg === "true" ? "bg-green-600" : "bg-amber-800"
                      }`} />
                    </span>
                    <div>
                      <h5 className="text-xs font-bold text-stone-900 leading-tight">{item.name}</h5>
                      <span className="text-xs font-semibold text-stone-700">₹{item.price}</span>
                    </div>
                  </div>

                  <div className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200">
                    <button
                      onClick={() => dispatch(updateQuantity({ itemId: item.itemId, delta: -1 }))}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-stone-700 hover:bg-white transition"
                    >
                      -
                    </button>
                    <span className="w-7 text-center text-xs font-bold text-stone-900">{item.quantity}</span>
                    <button
                      onClick={() => dispatch(updateQuantity({ itemId: item.itemId, delta: 1 }))}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-stone-700 hover:bg-white transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupons Section */}
            <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 mb-2">
                <Tag className="w-4 h-4 text-orange-500" />
                <span>Offers & Coupons</span>
              </div>

              {cart.appliedCoupon ? (
                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="text-xs font-bold text-emerald-700">{cart.appliedCoupon.code} applied!</span>
                      <p className="text-[10px] text-stone-500">Saved ₹{discountAmount.toFixed(1)} on this order</p>
                    </div>
                  </div>
                  <button
                    onClick={() => dispatch(removeCoupon())}
                    className="text-xs text-stone-500 hover:text-orange-600 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ENTER COUPON CODE"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-mono font-semibold uppercase focus:outline-orange-500 bg-white"
                    />
                    <button
                      onClick={() => handleApplyCoupon()}
                      className="px-3.5 py-1.5 rounded-lg bg-orange-500 text-white font-bold text-xs hover:bg-orange-600 transition"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-amber-800 font-bold">{couponError}</p>}

                  {/* Quick coupon chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {coupons.map((c) => (
                      <button
                        key={c.couponId}
                        onClick={() => handleApplyCoupon(c.code)}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-dashed border-orange-300 text-orange-700 hover:bg-orange-100 transition"
                      >
                        🏷️ {c.code}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Address */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
              <label className="block text-xs font-bold text-stone-800 mb-1">Delivery Address</label>
              <textarea
                rows={2}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-200 bg-white focus:outline-orange-500"
              />
            </div>

            {/* Payment Method */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
              <label className="block text-xs font-bold text-stone-800 mb-2">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {["UPI", "CARD", "CASH"].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      paymentMethod === method
                        ? "bg-white border-orange-500 text-orange-600 shadow-2xs"
                        : "bg-stone-100/70 border-transparent text-stone-600"
                    }`}
                  >
                    {method === "UPI" ? "📱 UPI" : method === "CARD" ? "💳 Card" : "💵 COD"}
                  </button>
                ))}
              </div>
            </div>

            {/* Bill Details */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
              <h5 className="font-bold text-stone-800">Bill Details</h5>
              <div className="flex justify-between text-stone-600">
                <span>Item Total</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery Partner Fee</span>
                <span>{deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Govt Taxes & Charges (5%)</span>
                <span>₹{taxAmount.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-stone-200 flex justify-between font-black text-stone-900 text-sm">
                <span>Grand Total</span>
                <span className="text-orange-600">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* OTP Security Notice */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-950 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
              <span>A secure 4-digit Delivery OTP will be generated upon placing this order. Share it with your rider at arrival.</span>
            </div>

          </div>
        )}

        {/* Footer / Place Order Button */}
        {cart.items.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-white">
            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-between px-5 transition active:scale-98 disabled:opacity-50"
            >
              <div>
                <span className="block text-xs font-normal opacity-90">Total to pay</span>
                <span className="text-base font-extrabold">₹{grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold">
                <span>{isSubmitting ? "Placing Order..." : "Place Order"}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
