import React, { useState } from "react";
import { Users, X, Share2, Copy, Check, Plus, AlertCircle } from "lucide-react";

export default function GroupOrderModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [groupName, setGroupName] = useState("Lunch Squad - Hitec City");
  const shareCode = "FOODIE-GRP-9241";

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(`https://foodie.app/join/${shareCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const members = [
    { name: "Arun Kumar (Host)", items: "1x Special Chicken Biryani", amount: 280, isHost: true },
    { name: "Priya Sharma", items: "1x Chicken 65 (Dry)", amount: 190, isHost: false },
    { name: "Karthik V", items: "1x Hot & Sour Soup", amount: 140, isHost: false }
  ];

  const totalAmount = members.reduce((sum, m) => sum + m.amount, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 bg-linear-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-wide">Group Food Ordering</h3>
              <p className="text-xs text-emerald-100">Order together with friends & split the bill effortlessly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          
          {/* Share Link Banner */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80">
            <label className="block text-xs font-bold text-emerald-900 mb-1">Share Group Link with Friends</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`https://foodie.app/join/${shareCode}`}
                className="flex-1 text-xs font-mono font-bold px-3 py-2 rounded-xl border border-emerald-200 bg-white text-emerald-800"
              />
              <button
                onClick={handleCopy}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-700 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* Members & Items */}
          <div>
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
              Shared Cart Members ({members.length})
            </h4>

            <div className="space-y-2">
              {members.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/70"
                >
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">{m.name}</span>
                    <span className="text-[11px] text-gray-500">{m.items}</span>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700">₹{m.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Split Summary */}
          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-1.5">
            <div className="flex justify-between font-bold text-gray-800">
              <span>Combined Total ({members.length} people)</span>
              <span className="text-emerald-700 text-sm">₹{totalAmount}</span>
            </div>
            <p className="text-[11px] text-gray-500">
              Each member's share is calculated automatically. Host can place order once everyone locks their dishes.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition"
          >
            Lock Cart & Proceed to Checkout
          </button>

        </div>

      </div>
    </div>
  );
}
