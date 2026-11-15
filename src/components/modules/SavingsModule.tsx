"use client";

import React, { useState, useEffect } from "react";
import { SavingsGoal } from "@/types";
import { StorageService } from "@/lib/storage";
import { Wallet, Target, Plus, Trash2, ArrowUpRight, ArrowDownLeft, Car, Laptop, Home, Plane } from "lucide-react";
import { AppIcon } from "@/components/common/AppIcon";
import confetti from "canvas-confetti";

export const SavingsModule: React.FC = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newIcon, setNewIcon] = useState("car");

  // Custom amount input for selected goal
  const [customGoalId, setCustomGoalId] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  useEffect(() => {
    setGoals(StorageService.getSavingsGoals());
  }, []);

  const handleDeposit = (goalId: string, amount: number) => {
    const updated = StorageService.depositSavings(goalId, amount);
    setGoals(updated);
    if (amount > 0) {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    }
  };

  const handleCustomDeposit = (goalId: string, isWithdraw: boolean = false) => {
    const val = parseFloat(customAmount);
    if (isNaN(val) || val <= 0) return;
    const finalAmount = isWithdraw ? -val : val;
    handleDeposit(goalId, finalAmount);
    setCustomAmount("");
    setCustomGoalId(null);
  };

  const handleDeleteGoal = (goalId: string) => {
    if (confirm("Точно удалить эту цель накопления?")) {
      const updated = StorageService.deleteSavingsGoal(goalId);
      setGoals(updated);
    }
  };

  const handleCreateGoal = () => {
    const target = parseFloat(newTarget);
    if (!newTitle.trim() || isNaN(target) || target <= 0) return;
    const goal: SavingsGoal = {
      id: "sg_" + Date.now(),
      title: newTitle.trim(),
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
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
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
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full whitespace-nowrap">
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

        {/* Add Goal Form */}
        {showAddGoal && (
          <div className="apple-card p-4 rounded-3xl space-y-3 border border-amber-500/20">
            <div className="text-xs font-bold text-white">Создать цель накопления</div>
            <input
              type="text"
              placeholder="Название цели (например: Пассат Б6, Ноутбук)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-[#1b1f2a] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white"
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Сумма цели в ₽ (например: 700000)"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                className="flex-1 bg-[#1b1f2a] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
              <select
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value)}
                className="bg-[#1b1f2a] border border-white/[0.08] rounded-xl px-2.5 py-2 text-xs text-white"
              >
                <option value="car">🚗 Авто</option>
                <option value="wallet">💰 Копилка</option>
                <option value="laptop">💻 Техника</option>
                <option value="home">🏠 Жилье</option>
                <option value="plane">✈️ Отпуск</option>
                <option value="target">🎯 Другое</option>
              </select>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddGoal(false)}
                className="flex-1 py-2 bg-white/[0.06] text-slate-300 font-semibold rounded-xl text-xs"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleCreateGoal}
                className="flex-1 py-2 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs active:scale-95 transition-all shadow-md"
              >
                Сохранить цель
              </button>
            </div>
          </div>
        )}

        {goals.length === 0 ? (
          <div className="apple-card p-6 rounded-3xl text-center space-y-2">
            <p className="text-xs text-slate-400">Пока нет целей накоплений</p>
            <button
              onClick={() => setShowAddGoal(true)}
              className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold"
            >
              Добавить цель
            </button>
          </div>
        ) : (
          goals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
            const isCustomOpen = customGoalId === goal.id;

            return (
              <div key={goal.id} className="apple-card p-4 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
                      <AppIcon name={goal.icon || "wallet"} className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white tracking-tight">{goal.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Осталось: {remaining.toLocaleString("ru-RU")} {goal.currency}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-amber-400">
                        {goal.currentAmount.toLocaleString("ru-RU")} / {goal.targetAmount.toLocaleString("ru-RU")} {goal.currency}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{pct}%</span>
                    </div>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-1.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Удалить цель"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className="bg-amber-400 h-full rounded-full transition-all"
                  />
                </div>

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-4 gap-1.5 pt-1">
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
                  <button
                    onClick={() => handleDeposit(goal.id, 10000)}
                    className="py-1.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-amber-300 text-xs font-mono font-semibold active:scale-95 transition-all text-center"
                  >
                    +10 000 ₽
                  </button>
                  <button
                    onClick={() => setCustomGoalId(isCustomOpen ? null : goal.id)}
                    className={`py-1.5 rounded-2xl text-xs font-semibold active:scale-95 transition-all text-center ${
                      isCustomOpen
                        ? "bg-amber-400 text-slate-950 font-bold"
                        : "bg-white/[0.04] hover:bg-white/[0.08] text-slate-300"
                    }`}
                  >
                    Своя
                  </button>
                </div>

                {/* Custom Amount Form */}
                {isCustomOpen && (
                  <div className="pt-2 border-t border-white/[0.04] flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Сумма ₽"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="flex-1 bg-black/40 border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                    />
                    <button
                      onClick={() => handleCustomDeposit(goal.id, false)}
                      className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 font-bold rounded-xl text-xs flex items-center gap-1 active:scale-95"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Внести</span>
                    </button>
                    <button
                      onClick={() => handleCustomDeposit(goal.id, true)}
                      className="px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 font-bold rounded-xl text-xs flex items-center gap-1 active:scale-95"
                    >
                      <ArrowDownLeft className="w-3.5 h-3.5" />
                      <span>Снять</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
