"use client";

import React, { useState, useEffect } from "react";
import { SavingsGoal } from "@/types";
import { StorageService } from "@/lib/storage";
import { PiggyBank, Target, Plus, Sparkles, TrendingUp } from "lucide-react";
import confetti from "canvas-confetti";

export const SavingsModule: React.FC = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newIcon, setNewIcon] = useState("🎯");

  useEffect(() => {
    setGoals(StorageService.getSavingsGoals());
  }, []);

  const handleDeposit = (goalId: string, amount: number) => {
    const updated = StorageService.depositSavings(goalId, amount);
    setGoals(updated);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
  };

  const handleCreateGoal = () => {
    const target = parseFloat(newTarget);
    if (!newTitle || isNaN(target) || target <= 0) return;
    const goal: SavingsGoal = {
      id: "sg_" + Date.now(),
      title: newTitle,
      icon: newIcon,
      targetAmount: target,
      currentAmount: 0,
      currency: "₽",
      color: "emerald",
    };
    const updated = [...goals, goal];
    setGoals(updated);
    StorageService.saveSavingsGoals(updated);
    setShowAddGoal(false);
    setNewTitle("");
    setNewTarget("");
  };

  const totalSaved = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
  const overallPercent = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Overall Savings Summary */}
      <div className="glass-card p-4 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-slate-900/60 to-slate-900/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <PiggyBank className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                Общий баланс накоплений
              </span>
              <div className="text-xl font-mono font-black text-white">
                {totalSaved.toLocaleString("ru-RU")} ₽
              </div>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/30">
            {overallPercent}%
          </span>
        </div>

        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-white/5">
          <div
            style={{ width: `${overallPercent}%` }}
            className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all"
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>Собрано: {totalSaved.toLocaleString("ru-RU")} ₽</span>
          <span>Цели: {totalTarget.toLocaleString("ru-RU")} ₽</span>
        </div>
      </div>

      {/* 2. Goals List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Target className="w-4 h-4 text-amber-400" />
            <span>Твои Копилки & Цели</span>
          </div>
          <button
            onClick={() => setShowAddGoal(!showAddGoal)}
            className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Новая цель</span>
          </button>
        </div>

        {/* Add Goal Modal / Form */}
        {showAddGoal && (
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-2.5">
            <span className="text-xs font-bold text-slate-200">Создать новую цель накопления</span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Иконка (🎯, 🚗, 📱)"
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value)}
                className="w-14 bg-slate-800 border border-slate-700 rounded-lg px-2 text-center text-sm text-white"
              />
              <input
                type="text"
                placeholder="Название цели (Ноутбук M3)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Сумма цели (120000)"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
              />
              <button
                onClick={handleCreateGoal}
                className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
              >
                Создать
              </button>
            </div>
          </div>
        )}

        {goals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

          return (
            <div
              key={goal.id}
              className="glass-card p-4 rounded-2xl border border-white/10 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl p-1.5 rounded-xl bg-white/5 border border-white/5">
                    {goal.icon}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">{goal.title}</h4>
                    <span className="text-[10px] text-slate-400">
                      Осталось: {remaining.toLocaleString("ru-RU")} {goal.currency}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-amber-400">
                    {goal.currentAmount.toLocaleString("ru-RU")} / {goal.targetAmount.toLocaleString("ru-RU")} {goal.currency}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{pct}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-white/5">
                <div
                  style={{ width: `${pct}%` }}
                  className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all"
                />
              </div>

              {/* Quick Deposit Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => handleDeposit(goal.id, 500)}
                  className="py-1.5 rounded-xl bg-white/5 hover:bg-amber-500/15 border border-white/5 hover:border-amber-500/30 text-amber-300 text-xs font-mono font-bold active:scale-95 transition-all"
                >
                  +500 ₽
                </button>
                <button
                  onClick={() => handleDeposit(goal.id, 1000)}
                  className="py-1.5 rounded-xl bg-white/5 hover:bg-amber-500/15 border border-white/5 hover:border-amber-500/30 text-amber-300 text-xs font-mono font-bold active:scale-95 transition-all"
                >
                  +1 000 ₽
                </button>
                <button
                  onClick={() => handleDeposit(goal.id, 5000)}
                  className="py-1.5 rounded-xl bg-white/5 hover:bg-amber-500/15 border border-white/5 hover:border-amber-500/30 text-amber-300 text-xs font-mono font-bold active:scale-95 transition-all"
                >
                  +5 000 ₽
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
