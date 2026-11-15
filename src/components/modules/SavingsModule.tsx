"use client";

import React, { useState, useEffect } from "react";
import { SavingsGoal } from "@/types";
import { StorageService } from "@/lib/storage";
import { Wallet, Target, Plus, Shield, Sparkles } from "lucide-react";
import { AppIcon } from "@/components/common/AppIcon";
import confetti from "canvas-confetti";

export const SavingsModule: React.FC = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newIcon, setNewIcon] = useState("target");

  useEffect(() => {
    setGoals(StorageService.getSavingsGoals());
  }, []);

  const handleDeposit = (goalId: string, amount: number) => {
    const updated = StorageService.depositSavings(goalId, amount);
    setGoals(updated);
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
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
      color: "amber",
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
      <div className="apple-card p-4 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                Общий баланс накоплений
              </span>
              <div className="text-xl font-mono font-bold text-white">
                {totalSaved.toLocaleString("ru-RU")} ₽
              </div>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
            {overallPercent}%
          </span>
        </div>

        <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
          <div
            style={{ width: `${overallPercent}%` }}
            className="bg-amber-400 h-full rounded-full transition-all"
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
          <span>Собрано: {totalSaved.toLocaleString("ru-RU")} ₽</span>
          <span>Цели: {totalTarget.toLocaleString("ru-RU")} ₽</span>
        </div>
      </div>

      {/* 2. Goals List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Target className="w-3.5 h-3.5 text-amber-400" />
            <span>Цели и копилки</span>
          </div>
          <button
            onClick={() => setShowAddGoal(!showAddGoal)}
            className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Новая цель</span>
          </button>
        </div>

        {/* Add Goal Inline Form */}
        {showAddGoal && (
          <div className="p-4 rounded-3xl bg-[#1b1f2a] border border-white/[0.08] space-y-2.5">
            <span className="text-xs font-semibold text-white">Новая цель накопления</span>
            <input
              type="text"
              placeholder="Название цели (Ноутбук, Отпуск)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-black/30 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white"
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Сумма цели (100000)"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                className="flex-1 bg-black/30 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
              <button
                onClick={handleCreateGoal}
                className="px-5 py-2 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs active:scale-95 transition-all"
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
              className="apple-card p-4 rounded-3xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <AppIcon name={goal.icon || "wallet"} className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-tight">{goal.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">
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
              <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
                <div
                  style={{ width: `${pct}%` }}
                  className="bg-amber-400 h-full rounded-full transition-all"
                />
              </div>

              {/* Quick Deposit Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => handleDeposit(goal.id, 500)}
                  className="py-1.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-amber-300 text-xs font-mono font-semibold active:scale-95 transition-all text-center"
                >
                  +500 ₽
                </button>
                <button
                  onClick={() => handleDeposit(goal.id, 1000)}
                  className="py-1.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-amber-300 text-xs font-mono font-semibold active:scale-95 transition-all text-center"
                >
                  +1 000 ₽
                </button>
                <button
                  onClick={() => handleDeposit(goal.id, 5000)}
                  className="py-1.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-amber-300 text-xs font-mono font-semibold active:scale-95 transition-all text-center"
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
