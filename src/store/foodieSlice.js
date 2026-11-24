import { createSlice } from "@reduxjs/toolkit";
import { SEED_RESTAURANTS, SEED_MENU_ITEMS, SEED_COUPONS, SEED_RIDERS } from "@/services/mockData";

const loadStored = (key, fallback) => {
  try {
    const item = localStorage.getItem(`foodie_state_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const saveStored = (key, val) => {
  try {
    localStorage.setItem(`foodie_state_${key}`, JSON.stringify(val));
  } catch (err) {
    console.debug("Failed to persist foodie state", err);
  }
};

const initialOrders = loadStored("orders", [
  {
    orderId: "ORD-98214",
    customerId: "cust-001",
    customerName: "Arun Kumar",
    customerPhone: "+91 98765 12345",
    restaurantId: "rest-001",
    restaurantName: "ABC Biryani & Kebabs",
    deliveryPartnerId: "rider-001",
    deliveryPartnerName: "Ramesh Kumar",
    deliveryPartnerPhone: "+91 98765 43210",
    orderType: "NORMAL",
    orderedItems: [
      { itemId: "item-001", name: "Special Chicken Biryani", price: 280, quantity: 1 },
      { itemId: "item-002", name: "Chicken 65 (Dry)", price: 190, quantity: 1 }
    ],
    subtotal: 470,
    deliveryFee: 30,
    discountAmount: 50,
    taxAmount: 23.5,
    totalAmount: 473.5,
    appliedCouponCode: "WELCOME50",
    orderStatus: "OUT_FOR_DELIVERY", // PLACED, ACCEPTED, PREPARING, READY_FOR_PICKUP, DELIVERY_PARTNER_ASSIGNED, PICKED_UP, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
    deliveryAddress: "Flat 402, Green Towers, Road No. 12, Banjara Hills, Hyderabad",
    deliveryOTP: "4821",
    isOtpVerified: "false",
    paymentStatus: "PAID",
    paymentMethod: "UPI",
    estimatedDeliveryTime: "25 mins",
    createdAt: new Date(Date.now() - 20 * 60000).toISOString(),
    statusHistory: [
      { status: "PLACED", time: new Date(Date.now() - 20 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      { status: "ACCEPTED", time: new Date(Date.now() - 17 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      { status: "PREPARING", time: new Date(Date.now() - 14 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      { status: "READY_FOR_PICKUP", time: new Date(Date.now() - 8 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      { status: "PICKED_UP", time: new Date(Date.now() - 5 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      { status: "OUT_FOR_DELIVERY", time: new Date(Date.now() - 2 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]
  }
]);

const initialState = {
  activeRole: loadStored("role", "CUSTOMER"), // CUSTOMER, VENDOR, RIDER, ADMIN
  weather: loadStored("weather", "RAINY"), // RAINY, SUNNY, CHILLY
  user: {
    userId: "cust-001",
    fullName: "Arun Kumar",
    email: "arun.kumar@example.com",
    phone: "+91 98765 12345",
    address: "Flat 402, Green Towers, Road No. 12, Banjara Hills, Hyderabad",
    rewardPoints: 240
  },
  restaurants: loadStored("restaurants", SEED_RESTAURANTS),
  menuItems: loadStored("menuItems", SEED_MENU_ITEMS),
  coupons: loadStored("coupons", SEED_COUPONS),
  riders: loadStored("riders", SEED_RIDERS),
  cart: loadStored("cart", {
    restaurantId: null,
    restaurantName: "",
    items: [],
    appliedCoupon: null
  }),
  orders: initialOrders,
  bookmarks: loadStored("bookmarks", ["item-001", "rest-001"]),
  complaints: loadStored("complaints", []),
  groupSession: null // { code, hostName, members: [], items: [] }
};

export const foodieSlice = createSlice({
  name: "foodie",
  initialState,
  reducers: {
    setActiveRole(state, action) {
      state.activeRole = action.payload;
      saveStored("role", action.payload);
    },
    setWeather(state, action) {
      state.weather = action.payload;
      saveStored("weather", action.payload);
    },
    addToCart(state, action) {
      const { item, restaurant } = action.payload;
      if (state.cart.restaurantId && state.cart.restaurantId !== restaurant.restaurantId) {
        // Reset cart if ordering from another restaurant
        state.cart.items = [{ ...item, quantity: 1 }];
        state.cart.restaurantId = restaurant.restaurantId;
        state.cart.restaurantName = restaurant.name;
        state.cart.appliedCoupon = null;
      } else {
        state.cart.restaurantId = restaurant.restaurantId;
        state.cart.restaurantName = restaurant.name;
        const existing = state.cart.items.find(i => i.itemId === item.itemId);
        if (existing) {
          existing.quantity += 1;
        } else {
          state.cart.items.push({ ...item, quantity: 1 });
        }
      }
      saveStored("cart", state.cart);
    },
    updateQuantity(state, action) {
      const { itemId, delta } = action.payload;
      const item = state.cart.items.find(i => i.itemId === itemId);
      if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
          state.cart.items = state.cart.items.filter(i => i.itemId !== itemId);
        }
      }
      if (state.cart.items.length === 0) {
        state.cart.restaurantId = null;
        state.cart.restaurantName = "";
        state.cart.appliedCoupon = null;
      }
      saveStored("cart", state.cart);
    },
    clearCart(state) {
      state.cart = {
        restaurantId: null,
        restaurantName: "",
        items: [],
        appliedCoupon: null
      };
      saveStored("cart", state.cart);
    },
    applyCoupon(state, action) {
      state.cart.appliedCoupon = action.payload;
      saveStored("cart", state.cart);
    },
    removeCoupon(state) {
      state.cart.appliedCoupon = null;
      saveStored("cart", state.cart);
    },
    toggleBookmark(state, action) {
      const id = action.payload;
      if (state.bookmarks.includes(id)) {
        state.bookmarks = state.bookmarks.filter(b => b !== id);
      } else {
        state.bookmarks.push(id);
      }
      saveStored("bookmarks", state.bookmarks);
    },
    updateRestaurantStatus(state, action) {
      const { restaurantId, availabilityStatus, closureReason, expectedReopeningTime } = action.payload;
      const rest = state.restaurants.find(r => r.restaurantId === restaurantId);
      if (rest) {
        rest.availabilityStatus = availabilityStatus;
        rest.closureReason = closureReason || "";
        rest.expectedReopeningTime = expectedReopeningTime || "";
      }
      saveStored("restaurants", state.restaurants);
    },
    toggleMenuItemAvailability(state, action) {
      const { itemId } = action.payload;
      const item = state.menuItems.find(i => i.itemId === itemId);
      if (item) {
        item.isAvailable = item.isAvailable === "true" ? "false" : "true";
      }
      saveStored("menuItems", state.menuItems);
    },
    createOrder(state, action) {
      const newOrder = action.payload;
      state.orders.unshift(newOrder);
      // clear cart
      state.cart = {
        restaurantId: null,
        restaurantName: "",
        items: [],
        appliedCoupon: null
      };
      saveStored("orders", state.orders);
      saveStored("cart", state.cart);
    },
    updateOrderStatus(state, action) {
      const { orderId, status, extra } = action.payload;
      const order = state.orders.find(o => o.orderId === orderId);
      if (order) {
        order.orderStatus = status;
        if (!order.statusHistory) order.statusHistory = [];
        order.statusHistory.push({
          status,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        if (extra) {
          Object.assign(order, extra);
        }
      }
      saveStored("orders", state.orders);
    },
    verifyOrderOTP(state, action) {
      const { orderId, enteredOtp } = action.payload;
      const order = state.orders.find(o => o.orderId === orderId);
      if (order) {
        if (order.deliveryOTP === enteredOtp) {
          order.orderStatus = "DELIVERED";
          order.isOtpVerified = "true";
          order.deliveredAt = new Date().toISOString();
          if (!order.statusHistory) order.statusHistory = [];
          order.statusHistory.push({
            status: "DELIVERED",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
          // Update rider earnings
          const rider = state.riders.find(r => r.partnerId === order.deliveryPartnerId);
          if (rider) {
            rider.totalEarnings += 65;
            rider.completedTrips += 1;
            rider.availabilityStatus = "ONLINE";
            saveStored("riders", state.riders);
          }
        }
      }
      saveStored("orders", state.orders);
    },
    addComplaint(state, action) {
      state.complaints.unshift(action.payload);
      saveStored("complaints", state.complaints);
    },
    resolveComplaint(state, action) {
      const { complaintId, status, refundAmount } = action.payload;
      const c = state.complaints.find(comp => comp.complaintId === complaintId);
      if (c) {
        c.status = status;
        c.refundAmount = refundAmount || 0;
      }
      saveStored("complaints", state.complaints);
    },
    setGroupSession(state, action) {
      state.groupSession = action.payload;
    }
  }
});

export const {
  setActiveRole,
  setWeather,
  addToCart,
  updateQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  toggleBookmark,
  updateRestaurantStatus,
  toggleMenuItemAvailability,
  createOrder,
  updateOrderStatus,
  verifyOrderOTP,
  addComplaint,
  resolveComplaint,
  setGroupSession
} = foodieSlice.actions;

export default foodieSlice.reducer;
