"use client";

import React, { useState } from "react";
import { X, Droplets, Scale, Coins, BookOpen, Flame } from "lucide-react";
import confetti from "canvas-confetti";

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWater: (ml: number) => void;
  onAddWeight: (kg: number) => void;
  onAddSavings: (amount: number) => void;
  onAddBookPages: (pages: number) => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  onAddWater,
  onAddWeight,
  onAddSavings,
  onAddBookPages,
}) => {
  const [weightInput, setWeightInput] = useState("");
  const [showWeightInput, setShowWeightInput] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-end p-3 animate-in fade-in duration-200">
      <div className="w-full max-w-md mx-auto glass-panel rounded-3xl border border-white/15 p-4 space-y-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Flame className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Быстрый ввод за 1 клик
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Weight Prompt */}
        {showWeightInput ? (
          <div className="p-3 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-2">
            <span className="text-xs font-bold text-slate-200">Введи вес тела (кг)</span>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                placeholder="78.2"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-sm font-mono text-white"
                autoFocus
              />
              <button
                onClick={() => {
                  const val = parseFloat(weightInput);
                  if (!isNaN(val)) {
                    onAddWeight(val);
                    confetti({ particleCount: 30, spread: 50 });
                    setShowWeightInput(false);
                    onClose();
                  }
                }}
                className="px-4 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs"
              >
                ОК
              </button>
            </div>
          </div>
        ) : null}

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          {/* Water */}
          <button
            onClick={() => {
              onAddWater(250);
              onClose();
            }}
            className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-blue-500/10 border border-white/5 hover:border-blue-500/40 text-left transition-all active:scale-95 flex items-center gap-3 group"
          >
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-200">+250 мл воды</div>
              <div className="text-[10px] text-slate-400">Один тап</div>
            </div>
          </button>

          {/* Weight */}
          <button
            onClick={() => setShowWeightInput(true)}
            className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/40 text-left transition-all active:scale-95 flex items-center gap-3 group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-200">Вес сегодня</div>
              <div className="text-[10px] text-slate-400">Утренний замер</div>
            </div>
          </button>

          {/* Savings */}
          <button
            onClick={() => {
              onAddSavings(1000);
              onClose();
            }}
            className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/40 text-left transition-all active:scale-95 flex items-center gap-3 group"
          >
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-200">+1 000 ₽</div>
              <div className="text-[10px] text-slate-400">В копилку</div>
            </div>
          </button>

          {/* Reading */}
          <button
            onClick={() => {
              onAddBookPages(20);
              onClose();
            }}
            className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/40 text-left transition-all active:scale-95 flex items-center gap-3 group"
          >
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-200">+20 страниц</div>
              <div className="text-[10px] text-slate-400">Чтение зачтено</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
