import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "@/store/foodieSlice";
import { Train, X, MapPin, Calendar, Check, Plus, AlertCircle } from "lucide-react";

export default function TrainOrderModal({ isOpen, onClose, onSelectRestaurant }) {
  const dispatch = useDispatch();
  const { restaurants, menuItems } = useSelector((state) => state.foodie);

  const [pnr, setPnr] = useState("4829104820");
  const [trainNumber, setTrainNumber] = useState("12723 - Telangana Express");
  const [selectedStation, setSelectedStation] = useState("SC");
  const [coach, setCoach] = useState("B3");
  const [seat, setSeat] = useState("45 (Lower Berth)");
  const [journeyDate, setJourneyDate] = useState("2026-11-24");

  if (!isOpen) return null;

  // Filter restaurants that support train delivery for the selected station
  const trainRestaurants = restaurants.filter(
    (r) => r.isTrainDeliveryPartner === "true" && r.supportedStationCodes.includes(selectedStation)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 bg-linear-to-r from-blue-700 via-indigo-700 to-sky-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <Train className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-wide flex items-center gap-2">
                <span>Food on Train — IRCTC Station Delivery</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono uppercase">
                  Berth Guaranteed
                </span>
              </h3>
              <p className="text-xs text-blue-100">Hot, fresh meals delivered straight to your train seat</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          
          {/* Journey Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">PNR Number (10 Digits)</label>
              <input
                type="text"
                value={pnr}
                onChange={(e) => setPnr(e.target.value)}
                maxLength={10}
                className="w-full text-xs font-mono font-bold px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Train Number / Name</label>
              <input
                type="text"
                value={trainNumber}
                onChange={(e) => setTrainNumber(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Delivery Station</label>
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-blue-600"
              >
                <option value="SC">Secunderabad Junction (SC)</option>
                <option value="HYB">Hyderabad Deccan Nampally (HYB)</option>
                <option value="KCG">Kacheguda (KCG)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Coach</label>
                <input
                  type="text"
                  value={coach}
                  onChange={(e) => setCoach(e.target.value)}
                  className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-blue-600 uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Seat / Berth</label>
                <input
                  type="text"
                  value={seat}
                  onChange={(e) => setSeat(e.target.value)}
                  className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Available Station Partners */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Approved Restaurants at {selectedStation} ({trainRestaurants.length})</span>
              <span className="text-[11px] text-blue-600 font-semibold">Special Train Coupon: TRAINMEAL</span>
            </h4>

            {trainRestaurants.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-gray-200 rounded-2xl">
                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-600 font-medium">No partner restaurants available at this station yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {trainRestaurants.map((rest) => (
                  <div
                    key={rest.restaurantId}
                    className="p-3.5 rounded-2xl border border-gray-200 hover:border-blue-500 transition shadow-2xs bg-white flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2.5 mb-2">
                        <img
                          src={rest.imageUrl}
                          alt={rest.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <h5 className="text-xs font-bold text-gray-900 leading-tight">{rest.name}</h5>
                          <p className="text-[10px] text-gray-500">{rest.cuisine}</p>
                          <span className="text-[10px] font-bold text-emerald-600">★ {rest.rating} • Station Express</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-600 mb-3">
                        Delivers in sealed food-grade packaging with wet wipes & sanitizer.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        if (onSelectRestaurant) onSelectRestaurant(rest);
                      }}
                      className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition"
                    >
                      View Train Menu
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
