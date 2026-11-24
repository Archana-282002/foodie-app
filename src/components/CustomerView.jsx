import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, toggleBookmark } from "@/store/foodieSlice";
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Plus, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Train, 
  Users, 
  Flame, 
  Soup, 
  Coffee, 
  Utensils, 
  Coins 
} from "lucide-react";

export default function CustomerView({ onOpenAi, onOpenTrain, onOpenGroup, onOpenCart }) {
  const dispatch = useDispatch();
  const { restaurants, menuItems, bookmarks, weather } = useSelector((state) => state.foodie);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedDiet, setSelectedDiet] = useState("ALL"); // ALL, VEG, NON_VEG
  const [budgetFilter, setBudgetFilter] = useState(0); // 0 = off, 100, 150, 200
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [addedItemIds, setAddedItemIds] = useState([]);

  // Category tags
  const categories = [
    { key: "ALL", label: "All Items", icon: Utensils },
    { key: "Biryani", label: "Biryani & Kebabs", icon: Flame },
    { key: "Soups", label: "Hot Soups", icon: Soup },
    { key: "Tiffins", label: "Pure Veg Tiffins", icon: Utensils },
    { key: "Beverages", label: "Tea & Chai", icon: Coffee }
  ];

  // Filter restaurants
  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiet = selectedDiet === "ALL" ? true : selectedDiet === "VEG" ? r.isVegOnly === "true" : true;
    return matchesSearch && matchesDiet;
  });

  // Filter menu items for selected restaurant or general search
  const filteredMenuItems = menuItems.filter((item) => {
    if (selectedRestaurant && item.restaurantId !== selectedRestaurant.restaurantId) return false;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" ? true : item.category === selectedCategory;
    const matchesDiet = selectedDiet === "ALL" ? true : selectedDiet === "VEG" ? item.isVeg === "true" : item.isVeg === "false";
    const matchesBudget = budgetFilter > 0 ? item.price <= budgetFilter : true;

    return matchesSearch && matchesCategory && matchesDiet && matchesBudget;
  });

  const handleAddItem = (item) => {
    const rest = restaurants.find((r) => r.restaurantId === item.restaurantId);
    if (!rest) return;

    if (rest.availabilityStatus === "TEMPORARILY_CLOSED") {
      alert(`Notice: ${rest.name} is currently ${rest.closureReason || "temporarily closed"}. Orders cannot be accepted right now.`);
      return;
    }

    dispatch(addToCart({ item, restaurant: rest }));
    setAddedItemIds((prev) => [...prev, item.itemId]);
    setTimeout(() => {
      setAddedItemIds((prev) => prev.filter((id) => id !== item.itemId));
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Hero Section (Orange & Amber Themed) */}
      <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-orange-500 via-amber-500 to-orange-600 text-white p-6 sm:p-10 shadow-xl shadow-orange-500/15">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white border border-white/30">
            <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
            <span>AI-Driven Food Discovery</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none">
            Craving Good Food? <br />
            <span className="text-yellow-200">Discover. Order. Enjoy.</span>
          </h1>

          <p className="text-sm sm:text-base text-orange-50 font-medium max-w-lg leading-relaxed">
            From hot monsoon snacks to station train meals, Foodie connects customers, vendors, and delivery partners with real-time OTP verification.
          </p>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            <button
              onClick={onOpenAi}
              className="px-4 py-2.5 rounded-xl bg-white text-orange-600 font-bold text-xs shadow-md hover:bg-orange-50 transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Ask AI Foodie Assistant</span>
            </button>

            <button
              onClick={onOpenTrain}
              className="px-4 py-2.5 rounded-xl bg-orange-950/30 hover:bg-orange-950/50 backdrop-blur-md text-white font-bold text-xs border border-white/20 transition flex items-center gap-2"
            >
              <Train className="w-4 h-4 text-orange-200" />
              <span>Order on Train (Berth Delivery)</span>
            </button>

            <button
              onClick={onOpenGroup}
              className="px-4 py-2.5 rounded-xl bg-orange-950/30 hover:bg-orange-950/50 backdrop-blur-md text-white font-bold text-xs border border-white/20 transition flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-orange-200" />
              <span>Group Split Order</span>
            </button>
          </div>
        </div>

        {/* Decorative Floating Circle */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* Smart Weather Warning / Recommendation Pill */}
      {weather === "RAINY" && (
        <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
              🌧️
            </div>
            <div>
              <h4 className="text-xs font-bold text-orange-950">Heavy Rain in Hyderabad — Smart Availability Active</h4>
              <p className="text-[11px] text-orange-800">
                Notice: <span className="font-semibold">Sizzling Wok & Momos</span> has temporarily paused orders due to waterlogging. Hot soups, biryani & tea are available from open restaurants!
              </p>
            </div>
          </div>
          <button
            onClick={onOpenAi}
            className="px-3 py-1.5 rounded-xl bg-orange-500 text-white font-bold text-xs hover:bg-orange-600 transition shrink-0 shadow-xs"
          >
            See Rain Menu
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search restaurants, dishes (e.g. Biryani, Soup, Dosa, Chai)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 bg-white text-xs font-medium focus:outline-orange-500 shadow-2xs"
          />
        </div>

        {/* Diet Toggles (No Red: Green for Veg, Deep Amber-Brown for Non-Veg) */}
        <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-2xl border border-stone-200">
          <button
            onClick={() => setSelectedDiet("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedDiet === "ALL" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            All Foods
          </button>
          <button
            onClick={() => setSelectedDiet("VEG")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              selectedDiet === "VEG" ? "bg-white text-emerald-700 shadow-xs" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Pure Veg</span>
          </button>
          <button
            onClick={() => setSelectedDiet("NON_VEG")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              selectedDiet === "NON_VEG" ? "bg-white text-amber-800 shadow-xs" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-800" />
            <span>Non-Veg</span>
          </button>
        </div>

        {/* Smart Budget Finder */}
        <div className="flex items-center gap-1.5 bg-orange-50/70 border border-orange-200 px-3 py-1.5 rounded-2xl">
          <Coins className="w-4 h-4 text-orange-600" />
          <span className="text-xs font-bold text-orange-950">Budget:</span>
          {[0, 100, 150, 200].map((b) => (
            <button
              key={b}
              onClick={() => setBudgetFilter(b)}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition ${
                budgetFilter === b
                  ? "bg-orange-500 text-white shadow-xs"
                  : "bg-white text-orange-700 border border-orange-200 hover:bg-orange-100"
              }`}
            >
              {b === 0 ? "Any" : `≤₹${b}`}
            </button>
          ))}
        </div>

      </div>

      {/* Selected Restaurant Banner */}
      {selectedRestaurant && (
        <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={selectedRestaurant.imageUrl}
              alt={selectedRestaurant.name}
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-stone-900">{selectedRestaurant.name}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedRestaurant.availabilityStatus === "OPEN"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-900"
                }`}>
                  {selectedRestaurant.availabilityStatus.replace(/_/g, " ")}
                </span>
              </div>
              <p className="text-xs text-stone-500">{selectedRestaurant.cuisine} • {selectedRestaurant.address}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedRestaurant(null)}
            className="text-xs font-bold text-orange-600 hover:text-orange-800 underline"
          >
            Show All Restaurants
          </button>
        </div>
      )}

      {/* Restaurants Section */}
      {!selectedRestaurant && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-stone-900 tracking-tight flex items-center gap-2">
              <span>Popular Restaurants Near You</span>
              <span className="text-xs bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full">
                {filteredRestaurants.length}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredRestaurants.map((rest) => {
              const isClosed = rest.availabilityStatus === "TEMPORARILY_CLOSED";
              const isBusy = rest.availabilityStatus === "BUSY";

              return (
                <div
                  key={rest.restaurantId}
                  className={`group rounded-3xl border border-stone-200/80 bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${
                    isClosed ? "opacity-85" : ""
                  }`}
                >
                  <div>
                    {/* Restaurant Image */}
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={rest.imageUrl}
                        alt={rest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />

                      {/* Status Badges (Warm Amber/Stone for Closure, Green for Open) */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {isClosed ? (
                          <span className="px-2.5 py-1 rounded-xl bg-stone-900 text-white font-bold text-[10px] shadow-md uppercase tracking-wider flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-amber-400" /> Temporarily Closed
                          </span>
                        ) : isBusy ? (
                          <span className="px-2.5 py-1 rounded-xl bg-amber-500 text-white font-bold text-[10px] shadow-md uppercase tracking-wider">
                            Kitchen Busy (Prep delay)
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white font-bold text-[10px] shadow-md uppercase tracking-wider">
                            Open Now
                          </span>
                        )}

                        {rest.isTrainDeliveryPartner === "true" && (
                          <span className="px-2 py-0.5 rounded-lg bg-orange-600 text-white font-bold text-[9px] shadow-xs uppercase tracking-wider">
                            🚆 Station Delivery
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-black text-stone-900 shadow-md flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{rest.rating}</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-4 space-y-1.5">
                      <h3 className="font-extrabold text-sm text-stone-900 group-hover:text-orange-600 transition">
                        {rest.name}
                      </h3>
                      <p className="text-xs text-stone-500 line-clamp-1">{rest.cuisine}</p>

                      <div className="flex items-center gap-3 text-[11px] text-stone-500 pt-1">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-orange-500" />
                          <span>{rest.avgPrepTimeMinutes} mins</span>
                        </span>
                        <span>•</span>
                        <span>{rest.city}</span>
                      </div>

                      {/* Closure warning box if closed */}
                      {isClosed && (
                        <div className="mt-2 p-2.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-800 text-[10px]">
                          <span className="font-bold block">{rest.closureReason || "Temporarily closed"}</span>
                          {rest.expectedReopeningTime && (
                            <span className="text-stone-600">Reopening expected at 2:30 PM</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="p-4 pt-0">
                    <button
                      onClick={() => setSelectedRestaurant(rest)}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition ${
                        isClosed
                          ? "bg-stone-100 text-stone-600 hover:bg-stone-200"
                          : "bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/20"
                      }`}
                    >
                      {isClosed ? "View Closure Details & Menu" : "View Menu & Order"}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dishes / Menu Items Section */}
      <div className="space-y-4 pt-4 border-t border-stone-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-stone-900 tracking-tight">
              {selectedRestaurant ? `${selectedRestaurant.name} — Menu` : "Signature Dishes"}
            </h2>
            <p className="text-xs text-stone-500">
              {budgetFilter > 0 ? `Showing meals within ₹${budgetFilter}` : "Freshly prepared & delivered hot"}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="hidden sm:flex gap-1.5 overflow-x-auto">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    selectedCategory === cat.key
                      ? "bg-orange-500 text-white shadow-xs"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMenuItems.map((item) => {
            const isAdded = addedItemIds.includes(item.itemId);
            const rest = restaurants.find((r) => r.restaurantId === item.restaurantId);
            const isRestClosed = rest?.availabilityStatus === "TEMPORARILY_CLOSED";

            return (
              <div
                key={item.itemId}
                className="p-3.5 rounded-2xl border border-stone-200/80 bg-white hover:border-orange-300 transition shadow-2xs flex gap-3.5 items-center justify-between"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-xs border flex items-center justify-center shrink-0 ${
                      item.isVeg === "true" ? "border-green-600" : "border-amber-800"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        item.isVeg === "true" ? "bg-green-600" : "bg-amber-800"
                      }`} />
                    </span>
                    <h4 className="text-xs font-bold text-stone-900 leading-tight">{item.name}</h4>
                  </div>

                  <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs font-black text-stone-900">₹{item.price}</span>
                    <span className="text-[10px] text-stone-400">•</span>
                    <span className="text-[10px] font-semibold text-stone-500">{rest?.name}</span>
                    {item.spiceLevel === "Spicy" && (
                      <span className="text-[9px] font-bold text-orange-800 bg-orange-100 px-1.5 py-0.2 rounded">
                        🌶️ Spicy
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative shrink-0 flex flex-col items-center">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover shadow-2xs"
                  />

                  <button
                    onClick={() => handleAddItem(item)}
                    disabled={isRestClosed}
                    className={`mt-1.5 px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      isRestClosed
                        ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                        : isAdded
                          ? "bg-emerald-600 text-white"
                          : "bg-white text-orange-600 border border-orange-500 hover:bg-orange-50 shadow-xs"
                    }`}
                  >
                    {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{isRestClosed ? "Closed" : isAdded ? "Added" : "ADD"}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
