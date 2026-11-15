"use client";

import React, { useState, useEffect } from "react";
import { BodyWeightLog, WorkoutSession } from "@/types";
import { StorageService } from "@/lib/storage";
import {
  Scale,
  Dumbbell,
  Timer,
  Trophy,
  Plus,
  Check,
  TrendingDown,
  RotateCcw,
  UtensilsCrossed,
} from "lucide-react";
import confetti from "canvas-confetti";

export const GymModule: React.FC = () => {
  const [weightLogs, setWeightLogs] = useState<BodyWeightLog[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [newWeight, setNewWeight] = useState<string>("");
  const [isAddingWeight, setIsAddingWeight] = useState(false);

  // Rest Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    setWeightLogs(StorageService.getWeightLogs());
    setWorkouts(StorageService.getWorkouts());
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const startTimer = (seconds: number) => {
    setTimerSeconds(seconds);
    setIsTimerRunning(true);
  };

  const handleSaveWeight = () => {
    const val = parseFloat(newWeight);
    if (!isNaN(val) && val > 30 && val < 300) {
      const updated = StorageService.addWeightLog(val);
      setWeightLogs(updated);
      setNewWeight("");
      setIsAddingWeight(false);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    }
  };

  const currentWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weightKg : 78.4;
  const startWeight = weightLogs.length > 0 ? weightLogs[0].weightKg : 79.2;
  const weightDelta = +(currentWeight - startWeight).toFixed(1);

  const toggleSetComplete = (workoutId: string, exerciseId: string, setId: string) => {
    const updated = workouts.map((w) => {
      if (w.id === workoutId) {
        return {
          ...w,
          exercises: w.exercises.map((e) => {
            if (e.id === exerciseId) {
              return {
                ...e,
                sets: e.sets.map((s) => {
                  if (s.id === setId) {
                    const nextVal = !s.completed;
                    if (nextVal) {
                      startTimer(90);
                    }
                    return { ...s, completed: nextVal };
                  }
                  return s;
                }),
              };
            }
            return e;
          }),
        };
      }
      return w;
    });
    setWorkouts(updated);
    StorageService.saveWorkouts(updated);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Rest Timer Floating Bar */}
      {timerSeconds > 0 && (
        <div className="sticky top-16 z-30 p-3.5 rounded-2xl bg-[#1c2230] border border-emerald-500/30 backdrop-blur-md flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Timer className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-300">Отдых между подходами</div>
              <div className="text-base font-mono font-bold text-white">
                {formatTimer(timerSeconds)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="px-3 py-1.5 rounded-full bg-emerald-400 text-slate-950 text-xs font-bold"
            >
              {isTimerRunning ? "Пауза" : "Дальше"}
            </button>
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(0);
              }}
              className="p-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-slate-300"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 1. Body Weight Card */}
      <div className="apple-card p-4 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white tracking-tight">Вес тела</div>
              <div className="text-[10px] text-slate-400">Цель: 75.0 кг (сушка)</div>
            </div>
          </div>
          <button
            onClick={() => setIsAddingWeight(true)}
            className="px-3 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.08] text-slate-200 text-xs font-semibold flex items-center gap-1 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Замер</span>
          </button>
        </div>

        {/* Input Inline */}
        {isAddingWeight && (
          <div className="p-3 rounded-2xl bg-[#1b1f2a] border border-white/[0.08] flex items-center gap-2">
            <input
              type="number"
              step="0.1"
              placeholder="78.2"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="flex-1 bg-black/30 border border-white/[0.08] rounded-xl px-3 py-1.5 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
              autoFocus
            />
            <button
              onClick={handleSaveWeight}
              className="px-4 py-1.5 bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs"
            >
              ОК
            </button>
            <button
              onClick={() => setIsAddingWeight(false)}
              className="px-2.5 py-1.5 text-slate-400 text-xs hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Stats Row */}
        <div className="flex items-baseline justify-between pt-1">
          <div>
            <span className="text-2xl font-bold font-mono tracking-tight text-white">
              {currentWeight}
            </span>
            <span className="text-xs font-semibold text-emerald-400 ml-1">кг</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-400">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>{weightDelta > 0 ? `+${weightDelta}` : weightDelta} кг</span>
          </div>
        </div>

        {/* Mini History Bar Chart (Apple Style) */}
        <div className="pt-2">
          <div className="flex items-end justify-between gap-1.5 h-14 px-1 border-b border-white/[0.04] pb-1">
            {weightLogs.slice(-7).map((log, idx, arr) => {
              const minW = 77;
              const maxW = 80;
              const hPercent = Math.max(
                20,
                Math.min(100, Math.round(((log.weightKg - minW) / (maxW - minW)) * 100))
              );
              const isLast = idx === arr.length - 1;
              return (
                <div key={log.id} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex justify-center items-end h-10">
                    <div
                      style={{ height: `${hPercent}%` }}
                      className={`w-full max-w-[24px] rounded-t-lg transition-all ${
                        isLast ? "bg-emerald-400" : "bg-white/[0.08] hover:bg-white/[0.15]"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[9px] font-mono ${
                      isLast ? "text-emerald-400 font-bold" : "text-slate-500"
                    }`}
                  >
                    {log.date.split("-").slice(1).join("/")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Nutrition Summary */}
      <div className="apple-card p-4 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white tracking-tight">Питание & КБЖУ</div>
              <div className="text-[10px] text-slate-400">Цель: 2 400 ккал в день</div>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400">1 850 / 2 400</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-2xl bg-white/[0.03]">
            <span className="text-[10px] uppercase font-bold text-emerald-400">Белки</span>
            <div className="text-xs font-mono font-bold text-white mt-0.5">145 / 160 г</div>
            <div className="w-full bg-white/[0.06] h-1 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-emerald-400 h-full w-[90%]" />
            </div>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/[0.03]">
            <span className="text-[10px] uppercase font-bold text-amber-400">Жиры</span>
            <div className="text-xs font-mono font-bold text-white mt-0.5">58 / 70 г</div>
            <div className="w-full bg-white/[0.06] h-1 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-amber-400 h-full w-[82%]" />
            </div>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/[0.03]">
            <span className="text-[10px] uppercase font-bold text-sky-400">Углеводы</span>
            <div className="text-xs font-mono font-bold text-white mt-0.5">210 / 280 г</div>
            <div className="w-full bg-white/[0.06] h-1 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-sky-400 h-full w-[75%]" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Workout Sessions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
            <span>Тренировочный дневник</span>
          </div>
          <button
            onClick={() => startTimer(90)}
            className="text-[11px] text-emerald-400 font-semibold hover:underline flex items-center gap-1"
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Таймер 90с</span>
          </button>
        </div>

        {workouts.map((workout) => (
          <div
            key={workout.id}
            className="apple-card p-4 rounded-3xl space-y-3.5"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-white tracking-tight">{workout.name}</h4>
                <p className="text-[10px] text-slate-400">
                  {workout.date} • {workout.durationMinutes} мин
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                Активная сессия
              </span>
            </div>

            {/* Exercises List */}
            <div className="space-y-3">
              {workout.exercises.map((ex, exIdx) => (
                <div
                  key={ex.id}
                  className="p-3 rounded-2xl bg-[#1b1f2a] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      {exIdx + 1}. {ex.name}
                    </span>
                    {ex.isPR && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px] font-bold">
                        <Trophy className="w-3 h-3 text-amber-400" />
                        Рекорд (PR)
                      </span>
                    )}
                  </div>

                  {/* Sets Grid */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {ex.sets.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => toggleSetComplete(workout.id, ex.id, s.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          s.completed
                            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                            : "bg-white/[0.03] border-transparent text-slate-300 hover:bg-white/[0.06]"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                          <span>Сет {s.setNumber}</span>
                          {s.completed ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <span className="text-[9px]">тап</span>
                          )}
                        </div>
                        <div className="font-mono font-bold text-xs">
                          {s.weightKg} кг × {s.reps}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
