import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveRole, setWeather } from "@/store/foodieSlice";
import { 
  ShoppingBag, 
  CloudRain, 
  Sun, 
  Snowflake, 
  UtensilsCrossed, 
  Bike, 
  ShieldCheck, 
  Sparkles,
  MapPin,
  Train,
  Users,
  ChevronDown
} from "lucide-react";

export default function Navbar({ onOpenCart, onOpenAi, onOpenTrain, onOpenGroup, onOpenTracker }) {
  const dispatch = useDispatch();
  const { activeRole, weather, cart, orders, user } = useSelector((state) => state.foodie);

  const totalCartCount = cart.items.reduce((acc, curr) => acc + curr.quantity, 0);
  const activeOrder = orders.find(o => o.orderStatus !== "DELIVERED" && o.orderStatus !== "CANCELLED");

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-100/80 shadow-xs">
      
      {/* 1. Top Sub-Bar: Weather Announcement & Simulation Switcher */}
      <div className="bg-orange-50/70 border-b border-orange-100/60 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Weather Status Notice */}
          <div className="flex items-center gap-2 text-orange-950 font-medium truncate">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-orange-800 border border-orange-200/80 shadow-2xs shrink-0">
              {weather === "RAINY" && <CloudRain className="w-3.5 h-3.5 text-orange-500 animate-bounce" />}
              {weather === "SUNNY" && <Sun className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />}
              {weather === "CHILLY" && <Snowflake className="w-3.5 h-3.5 text-sky-500" />}
              <span>{weather === "RAINY" ? "Rain in Hyderabad" : weather === "SUNNY" ? "Sunny 32°C in Hyderabad" : "Pleasant 19°C"}</span>
            </span>

            <span className="text-stone-600 truncate text-[11px]">
              {weather === "RAINY" 
                ? "🌧️ Monsoon special: Hot soups, chilli chicken & ginger masala chai recommended." 
                : weather === "SUNNY" 
                  ? "☀️ Stay energized with refreshing coolers, fruit bowls & quick meals." 
                  : "❄️ Warm comfort food and freshly steamed bowls recommended."}
            </span>
          </div>

          {/* Weather Toggle Control */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[11px] text-stone-500 font-medium hidden sm:inline mr-1">Simulate:</span>
            <div className="inline-flex p-0.5 bg-orange-100/70 rounded-lg border border-orange-200/60">
              <button 
                onClick={() => dispatch(setWeather("RAINY"))}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition flex items-center gap-1 ${
                  weather === "RAINY" 
                    ? "bg-orange-500 text-white shadow-xs" 
                    : "text-stone-600 hover:text-orange-900"
                }`}
              >
                <span>🌧️</span> <span className="hidden md:inline">Rain</span>
              </button>
              <button 
                onClick={() => dispatch(setWeather("SUNNY"))}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition flex items-center gap-1 ${
                  weather === "SUNNY" 
                    ? "bg-orange-500 text-white shadow-xs" 
                    : "text-stone-600 hover:text-orange-900"
                }`}
              >
                <span>☀️</span> <span className="hidden md:inline">Sunny</span>
              </button>
              <button 
                onClick={() => dispatch(setWeather("CHILLY"))}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition flex items-center gap-1 ${
                  weather === "CHILLY" 
                    ? "bg-orange-500 text-white shadow-xs" 
                    : "text-stone-600 hover:text-orange-900"
                }`}
              >
                <span>❄️</span> <span className="hidden md:inline">Chilly</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Left: Brand Logo & Location Pill */}
          <div className="flex items-center gap-4 shrink-0">
            <div 
              className="flex items-center gap-2.5 cursor-pointer group select-none" 
              onClick={() => dispatch(setActiveRole("CUSTOMER"))}
            >
              <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
                F
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tight text-stone-900">Foodie</span>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded-md tracking-wider">
                    SMART
                  </span>
                </div>
                <span className="block text-[10px] text-stone-400 font-semibold tracking-wider uppercase">
                  Discover. Order. Enjoy.
                </span>
              </div>
            </div>

            {/* Location Badge (No awkward text wrapping) */}
            <div className="hidden lg:flex items-center gap-2 h-9 px-3 rounded-xl bg-orange-50/50 border border-orange-200/70 text-xs font-semibold text-stone-700 whitespace-nowrap shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span>Banjara Hills, Hyderabad</span>
              <span className="text-[10px] font-bold text-orange-600 bg-orange-100/80 px-1.5 py-0.2 rounded">
                Auto
              </span>
            </div>
          </div>

          {/* Center: Clean Segmented Role Switcher */}
          <div className="flex items-center p-1 rounded-2xl bg-stone-100 border border-stone-200/80 shadow-inner">
            <button
              onClick={() => dispatch(setActiveRole("CUSTOMER"))}
              className={`flex items-center gap-1.5 h-8 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeRole === "CUSTOMER" 
                  ? "bg-orange-500 text-white shadow-sm" 
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/50"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Customer</span>
            </button>

            <button
              onClick={() => dispatch(setActiveRole("VENDOR"))}
              className={`flex items-center gap-1.5 h-8 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeRole === "VENDOR" 
                  ? "bg-orange-500 text-white shadow-sm" 
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/50"
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Vendor</span>
            </button>

            <button
              onClick={() => dispatch(setActiveRole("RIDER"))}
              className={`flex items-center gap-1.5 h-8 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeRole === "RIDER" 
                  ? "bg-orange-500 text-white shadow-sm" 
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/50"
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Rider</span>
            </button>

            <button
              onClick={() => dispatch(setActiveRole("ADMIN"))}
              className={`flex items-center gap-1.5 h-8 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeRole === "ADMIN" 
                  ? "bg-orange-500 text-white shadow-sm" 
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/50"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>

          {/* Right: Feature Buttons & Profile */}
          <div className="flex items-center gap-2 shrink-0">
            {activeRole === "CUSTOMER" && (
              <>
                {/* AI Assistant Button (Orange Theme) */}
                <button
                  onClick={onOpenAi}
                  className="hidden md:flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-bold bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-xs hover:from-orange-600 hover:to-amber-600 transition whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-200 animate-pulse" />
                  <span>AI Foodie</span>
                </button>

                {/* Train Delivery Button */}
                <button
                  onClick={onOpenTrain}
                  className="hidden lg:flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-bold bg-orange-50 text-orange-800 border border-orange-200/80 hover:bg-orange-100 transition whitespace-nowrap"
                >
                  <Train className="w-3.5 h-3.5 text-orange-600" />
                  <span>Food on Train</span>
                </button>

                {/* Group Order Button */}
                <button
                  onClick={onOpenGroup}
                  className="hidden xl:flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-bold bg-orange-50 text-orange-800 border border-orange-200/80 hover:bg-orange-100 transition whitespace-nowrap"
                >
                  <Users className="w-3.5 h-3.5 text-orange-600" />
                  <span>Group Order</span>
                </button>

                {/* Active Order Tracker Pill (Orange & Amber Theme) */}
                {activeOrder && (
                  <button
                    onClick={onOpenTracker}
                    className="flex items-center gap-2 h-9 px-3 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition whitespace-nowrap"
                  >
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                    <span>Track #{activeOrder.orderId}</span>
                  </button>
                )}

                {/* Cart Button */}
                <button
                  onClick={onOpenCart}
                  className="relative flex items-center justify-center h-9 px-3.5 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition shadow-sm shadow-orange-500/20 font-bold text-xs gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">Cart</span>
                  {totalCartCount > 0 && (
                    <span className="bg-white text-orange-600 font-black text-[10px] px-1.5 py-0.2 rounded-full shadow-2xs">
                      {totalCartCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* Profile Avatar Badge */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-orange-100">
              <div className="w-9 h-9 rounded-xl bg-orange-100 border border-orange-200 text-orange-800 font-extrabold text-xs flex items-center justify-center shadow-2xs">
                {activeRole === "CUSTOMER" ? "AK" : activeRole === "VENDOR" ? "VN" : activeRole === "RIDER" ? "RK" : "AD"}
              </div>
              <div className="hidden 2xl:block text-left leading-tight">
                <span className="block text-xs font-bold text-stone-900">
                  {activeRole === "CUSTOMER" ? user.fullName : activeRole === "VENDOR" ? "ABC Biryani Kitchen" : activeRole === "RIDER" ? "Ramesh Kumar" : "System SuperAdmin"}
                </span>
                <span className="block text-[10px] text-stone-400 capitalize">{activeRole.toLowerCase()} mode</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
