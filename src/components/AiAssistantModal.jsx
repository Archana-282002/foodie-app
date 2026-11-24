import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "@/store/foodieSlice";
import { Sparkles, X, Send, Bot, User, Plus, Check } from "lucide-react";

export default function AiAssistantModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { weather, menuItems, restaurants } = useSelector((state) => state.foodie);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `Hello! I'm your Foodie AI Assistant. The weather in Hyderabad is currently ${
        weather === "RAINY" ? "🌧️ Rainy & Cool" : weather === "SUNNY" ? "☀️ Sunny & Warm" : "❄️ Chilly"
      }. What are you craving today?`,
      recommendations: []
    }
  ]);
  const [addedIds, setAddedIds] = useState([]);

  if (!isOpen) return null;

  const quickPrompts = [
    "🌧️ It's raining! Suggest something hot and spicy",
    "💰 Find meals under ₹150 nearby",
    "☕ Best tea & snacks for this evening",
    "🥗 Healthy light lunch options"
  ];

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg = { sender: "user", text: query };
    setInput("");

    let matchedItems = [];
    let replyText = "";

    const lower = query.toLowerCase();

    const openRestIds = restaurants
      .filter((r) => r.availabilityStatus === "OPEN")
      .map((r) => r.restaurantId);

    const availableMenuItems = menuItems.filter((item) =>
      openRestIds.includes(item.restaurantId) && item.isAvailable === "true"
    );

    if (lower.includes("rain") || lower.includes("spicy") || lower.includes("hot")) {
      matchedItems = availableMenuItems.filter((i) =>
        i.weatherTags.includes("rainy") || i.spiceLevel === "Spicy" || i.category === "Soups"
      );
      replyText = "Since it's rainy outside, I recommend these piping hot and spicy favorites from restaurants that are open right now:";
    } else if (lower.includes("150") || lower.includes("budget") || lower.includes("cheap")) {
      matchedItems = availableMenuItems.filter((i) => i.price <= 150);
      replyText = "Here are top-rated delicious meals under ₹150 that fit your budget perfectly:";
    } else if (lower.includes("tea") || lower.includes("snack") || lower.includes("chai")) {
      matchedItems = availableMenuItems.filter((i) =>
        i.category === "Beverages" || i.category === "Snacks" || i.name.toLowerCase().includes("chai")
      );
      replyText = "Freshly brewed masala tea and crispy hot pakodas ready for pickup:";
    } else if (lower.includes("healthy") || lower.includes("light") || lower.includes("breakfast")) {
      matchedItems = availableMenuItems.filter((i) =>
        i.category === "Tiffins" || i.isVeg === "true"
      );
      replyText = "Here are nutritious, comforting vegetarian options ready to energize your day:";
    } else {
      matchedItems = availableMenuItems.slice(0, 3);
      replyText = "Here are our top chef recommendations based on your local preferences and current availability:";
    }

    const aiMsg = {
      sender: "ai",
      text: replyText,
      recommendations: matchedItems.slice(0, 3)
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
  };

  const handleAddFromAi = (item) => {
    const restaurant = restaurants.find((r) => r.restaurantId === item.restaurantId);
    if (restaurant) {
      dispatch(addToCart({ item, restaurant }));
      setAddedIds((prev) => [...prev, item.itemId]);
      setTimeout(() => {
        setAddedIds((prev) => prev.filter((id) => id !== item.itemId));
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl flex flex-col h-[600px] border border-orange-100 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header (Orange Theme) */}
        <div className="p-4 bg-linear-to-r from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <Sparkles className="w-5 h-5 text-yellow-200" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide flex items-center gap-2">
                <span>Foodie AI Assistant</span>
                <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full font-mono uppercase">
                  {weather} mode
                </span>
              </h3>
              <p className="text-[11px] text-orange-100">Smart weather & mood food recommendations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.sender === "ai" && (
                <div className="w-7 h-7 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs ${
                  m.sender === "user"
                    ? "bg-orange-500 text-white rounded-tr-xs"
                    : "bg-white border border-stone-200 text-stone-800 shadow-2xs rounded-tl-xs"
                }`}
              >
                <p className="leading-relaxed">{m.text}</p>

                {/* Recommendations */}
                {m.recommendations && m.recommendations.length > 0 && (
                  <div className="mt-3 space-y-2 pt-2 border-t border-stone-100">
                    {m.recommendations.map((item) => {
                      const rest = restaurants.find((r) => r.restaurantId === item.restaurantId);
                      const isAdded = addedIds.includes(item.itemId);

                      return (
                        <div
                          key={item.itemId}
                          className="flex items-center justify-between p-2 rounded-xl bg-orange-50/50 border border-orange-200/60"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <span className="font-bold text-stone-900 block leading-tight">{item.name}</span>
                              <span className="text-[10px] text-stone-500">{rest?.name} • ₹{item.price}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleAddFromAi(item)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                              isAdded
                                ? "bg-emerald-600 text-white"
                                : "bg-orange-500 hover:bg-orange-600 text-white shadow-2xs"
                            }`}
                          >
                            {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                            <span>{isAdded ? "Added" : "Add"}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {m.sender === "user" && (
                <div className="w-7 h-7 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Prompts */}
        <div className="p-2.5 bg-white border-t border-stone-100 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
          {quickPrompts.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-full bg-orange-50 text-orange-800 border border-orange-200 whitespace-nowrap hover:bg-orange-100 transition font-medium"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-stone-200 flex gap-2">
          <input
            type="text"
            placeholder="Ask anything (e.g. 'Craving hot soup for dinner under ₹200')..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-orange-500 bg-stone-50/50"
          />
          <button
            onClick={() => handleSend()}
            className="px-4 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-xs hover:bg-orange-600 transition flex items-center gap-1.5 shadow-md shadow-orange-500/20"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
