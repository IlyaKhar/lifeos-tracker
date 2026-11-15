"use client";

import React, { useState } from "react";
import { UserProfile, FitnessGoal } from "@/types";
import { Sparkles, ArrowRight, ArrowLeft, Check, Dumbbell, Target, User, Heart } from "lucide-react";
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

    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    onComplete(profile);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md glass-panel rounded-3xl border border-white/15 p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[480px]">
        
        {/* Glow ambient */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Step Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
              Шаг {step} из 3 • Настройка твоего LifeOS
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
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              style={{ width: `${(step / 3) * 100}%` }}
              className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-300"
            />
          </div>
        </div>

        {/* STEP 1: Имя и возраст */}
        {step === 1 && (
          <div className="space-y-4 my-auto py-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400">
                <User className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-lg font-extrabold text-white">Давай знакомиться!</h2>
                <p className="text-xs text-slate-400">Как к тебе обращаться в приложении?</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Твоё имя или ник
                </label>
                <input
                  type="text"
                  placeholder="Илья"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
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
                  className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Тело и цели в зале */}
        {step === 2 && (
          <div className="space-y-4 my-auto py-2">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400">
                <Dumbbell className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-lg font-extrabold text-white">Физическая форма</h2>
                <p className="text-xs text-slate-400">Поможет рассчитать чекпоинты и калории</p>
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
                  className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none"
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
                  className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Главная цель в зале:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: "lose_weight", label: "🔥 Сушка / Сбросить вес" },
                  { id: "build_muscle", label: "💪 Набор сухой массы" },
                  { id: "strength", label: "⚡ Рост силовых (PR)" },
                  { id: "keep_fit", label: "🧘 Тонус и здоровье" },
                ].map((g) => (
                  <button
                    type="button"
                    key={g.id}
                    onClick={() => setFitnessGoal(g.id as FitnessGoal)}
                    className={`p-2.5 rounded-xl border text-left transition-all font-medium ${
                      fitnessGoal === g.id
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                        : "bg-slate-900/60 border-white/5 text-slate-300 hover:border-white/20"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Финансовая цель и старт */}
        {step === 3 && (
          <div className="space-y-4 my-auto py-2">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400">
                <Target className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-lg font-extrabold text-white">Цель накоплений</h2>
                <p className="text-xs text-slate-400">Какую главную мечту оцифруем в копилку?</p>
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
                  className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
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
                  className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  Мы сгенерируем для тебя персональные чекпоинты прогресса на основе этих данных!
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Nav Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Назад</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-600 hover:to-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <span>Дальше</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-600 hover:to-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
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
