"use client";

import React, { useState } from "react";
import { UserProfile, FitnessGoal } from "@/types";
import { Sparkles, ArrowRight, ArrowLeft, Dumbbell, Target, User, Flame, Activity, Zap } from "lucide-react";
import confetti from "canvas-confetti";

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: UserProfile) => void;
  onClose?: () => void;
  initialProfile?: UserProfile;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  onClose,
  initialProfile,
}) => {
  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState(initialProfile?.name || "Илья");
  const [age, setAge] = useState<string>(initialProfile?.age?.toString() || "22");
  const [currentWeight, setCurrentWeight] = useState<string>(
    initialProfile?.currentWeight?.toString() || "78.4"
  );
  const [targetWeight, setTargetWeight] = useState<string>(
    initialProfile?.targetWeight?.toString() || "75.0"
  );
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>(
    initialProfile?.fitnessGoal || "lose_weight"
  );
  const [savingsTargetName, setSavingsTargetName] = useState(
    initialProfile?.savingsTargetName || "3D-принтер Bambu Lab"
  );
  const [savingsTargetAmount, setSavingsTargetAmount] = useState<string>(
    initialProfile?.savingsTargetAmount?.toString() || "95000"
  );

  if (!isOpen) return null;

  const handleFinish = () => {
    const profile: UserProfile = {
      name: name.trim() || "Малой",
      age: parseInt(age) || 22,
      currentWeight: parseFloat(currentWeight) || 78.4,
      targetWeight: parseFloat(targetWeight) || 75.0,
      fitnessGoal,
      focusCategories: ["gym", "3d", "savings", "reading", "english", "work"],
      savingsTargetName: savingsTargetName.trim() || "Цель мечты",
      savingsTargetAmount: parseFloat(savingsTargetAmount) || 100000,
      isOnboarded: true,
      createdAt: new Date().toISOString(),
    };

    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    onComplete(profile);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md apple-card rounded-3xl p-6 shadow-2xl relative flex flex-col justify-between min-h-[480px]">

        {/* Step Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
              Шаг {step} из 3 • Настройка профиля
            </span>
            {onClose && (
              <button
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            )}
          </div>
          <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
            <div
              style={{ width: `${(step / 3) * 100}%` }}
              className="bg-emerald-400 h-full rounded-full transition-all duration-300"
            />
          </div>
        </div>

        {/* STEP 1: Имя и возраст */}
        {step === 1 && (
          <div className="space-y-4 my-auto py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Давай знакомиться</h2>
                <p className="text-xs text-slate-400">Как к тебе обращаться в приложении?</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Твоё имя
                </label>
                <input
                  type="text"
                  placeholder="Илья"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1b1f2a] border border-white/[0.08] focus:border-emerald-500 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Возраст</label>
                <input
                  type="number"
                  placeholder="22"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-[#1b1f2a] border border-white/[0.08] focus:border-emerald-500 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Тело и цели в зале */}
        {step === 2 && (
          <div className="space-y-4 my-auto py-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Физическая форма</h2>
                <p className="text-xs text-slate-400">Для расчета чекпоинтов и прогресса</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Текущий вес (кг)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="78.4"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  className="w-full bg-[#1b1f2a] border border-white/[0.08] focus:border-emerald-500 rounded-2xl px-3 py-2 text-sm text-white font-mono focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Целевой вес (кг)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="75.0"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  className="w-full bg-[#1b1f2a] border border-white/[0.08] focus:border-emerald-500 rounded-2xl px-3 py-2 text-sm text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Главная цель в зале:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: "lose_weight", label: "Сушка / Сбросить вес", icon: Flame },
                  { id: "build_muscle", label: "Набор сухой массы", icon: Dumbbell },
                  { id: "strength", label: "Рост силовых (PR)", icon: Zap },
                  { id: "keep_fit", label: "Тонус и здоровье", icon: Activity },
                ].map((g) => {
                  const Icon = g.icon;
                  const isSel = fitnessGoal === g.id;
                  return (
                    <button
                      type="button"
                      key={g.id}
                      onClick={() => setFitnessGoal(g.id as FitnessGoal)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2 ${
                        isSel
                          ? "bg-emerald-500/15 border-emerald-500/50 text-white font-semibold"
                          : "bg-white/[0.03] border-transparent text-slate-300 hover:bg-white/[0.06]"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSel ? "text-emerald-400" : "text-slate-400"}`} />
                      <span className="text-[11px] leading-tight">{g.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Финансовая цель */}
        {step === 3 && (
          <div className="space-y-4 my-auto py-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Цель накоплений</h2>
                <p className="text-xs text-slate-400">Какую цель оцифруем в копилку?</p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Название цели
                </label>
                <input
                  type="text"
                  placeholder="3D-принтер Bambu Lab P1S"
                  value={savingsTargetName}
                  onChange={(e) => setSavingsTargetName(e.target.value)}
                  className="w-full bg-[#1b1f2a] border border-white/[0.08] focus:border-amber-500 rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Сумма цели (рублей)
                </label>
                <input
                  type="number"
                  placeholder="95000"
                  value={savingsTargetAmount}
                  onChange={(e) => setSavingsTargetAmount(e.target.value)}
                  className="w-full bg-[#1b1f2a] border border-white/[0.08] focus:border-amber-500 rounded-2xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Nav */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Назад</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-full bg-white text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow active:scale-95 transition-all"
            >
              <span>Дальше</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-full bg-emerald-400 hover:bg-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Создать мой план</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
