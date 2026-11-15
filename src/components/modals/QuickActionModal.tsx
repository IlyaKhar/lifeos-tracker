"use client";

import React, { useState } from "react";
import { X, Droplets, Scale, Wallet, BookOpen, Sparkles } from "lucide-react";
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
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex flex-col justify-end p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md mx-auto apple-card rounded-3xl p-5 space-y-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Быстрый ввод
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Weight Prompt */}
        {showWeightInput ? (
          <div className="p-3.5 rounded-2xl bg-[#1b1f2a] border border-white/[0.08] space-y-2">
            <span className="text-xs font-semibold text-slate-200">Утренний вес тела (кг)</span>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                placeholder="78.2"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                className="flex-1 bg-black/30 border border-white/[0.08] rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
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
                className="px-5 py-2 bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs active:scale-95 transition-all"
              >
                Сохранить
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
            className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-blue-500/[0.08] border border-white/[0.04] hover:border-blue-500/30 text-left transition-all active:scale-95 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white">+250 мл воды</div>
              <div className="text-[10px] text-slate-400">В один клик</div>
            </div>
          </button>

          {/* Weight */}
          <button
            onClick={() => setShowWeightInput(true)}
            className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-emerald-500/[0.08] border border-white/[0.04] hover:border-emerald-500/30 text-left transition-all active:scale-95 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white">Вес тела</div>
              <div className="text-[10px] text-slate-400">Записать замер</div>
            </div>
          </button>

          {/* Savings */}
          <button
            onClick={() => {
              onAddSavings(1000);
              onClose();
            }}
            className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-amber-500/[0.08] border border-white/[0.04] hover:border-amber-500/30 text-left transition-all active:scale-95 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white">+1 000 ₽</div>
              <div className="text-[10px] text-slate-400">В копилку</div>
            </div>
          </button>

          {/* Reading */}
          <button
            onClick={() => {
              onAddBookPages(20);
              onClose();
            }}
            className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-purple-500/[0.08] border border-white/[0.04] hover:border-purple-500/30 text-left transition-all active:scale-95 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white">+20 страниц</div>
              <div className="text-[10px] text-slate-400">Чтение зачтено</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
