"use client";

import React, { useState, useEffect } from "react";
import { BodyWeightLog, WorkoutSession, Exercise } from "@/types";
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
  Trash2,
  Calendar,
} from "lucide-react";
import confetti from "canvas-confetti";

export const GymModule: React.FC = () => {
  const [weightLogs, setWeightLogs] = useState<BodyWeightLog[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [newWeight, setNewWeight] = useState<string>("");
  const [isAddingWeight, setIsAddingWeight] = useState(false);

  // New Workout Modal
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState("");

  // New Exercise Modal
  const [activeWorkoutForEx, setActiveWorkoutForEx] = useState<string | null>(null);
  const [newExName, setNewExName] = useState("");

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
      confetti({ particleCount: 30, spread: 50 });
    }
  };

  const handleCreateWorkout = () => {
    if (!newWorkoutName.trim()) return;
    const session: WorkoutSession = {
      id: "w_" + Date.now(),
      date: new Intl.DateTimeFormat("ru-RU", { weekday: "short", day: "numeric", month: "short" }).format(new Date()),
      name: newWorkoutName.trim(),
      durationMinutes: 60,
      exercises: [],
    };
    const updated = StorageService.addWorkout(session);
    setWorkouts(updated);
    setNewWorkoutName("");
    setShowAddWorkout(false);
  };

  const handleDeleteWorkout = (id: string) => {
    if (confirm("Удалить этот день тренировки?")) {
      const updated = StorageService.deleteWorkout(id);
      setWorkouts(updated);
    }
  };

  const handleAddExercise = (workoutId: string) => {
    if (!newExName.trim()) return;
    const updated = workouts.map((w) => {
      if (w.id === workoutId) {
        const newEx: Exercise = {
          id: "e_" + Date.now(),
          name: newExName.trim(),
          targetSets: 3,
          sets: [
            { id: "s_1", setNumber: 1, weightKg: 60, reps: 10, completed: false },
            { id: "s_2", setNumber: 2, weightKg: 60, reps: 10, completed: false },
            { id: "s_3", setNumber: 3, weightKg: 60, reps: 10, completed: false },
          ],
        };
        return { ...w, exercises: [...w.exercises, newEx] };
      }
      return w;
    });
    setWorkouts(updated);
    StorageService.saveWorkouts(updated);
    setNewExName("");
    setActiveWorkoutForEx(null);
  };

  const handleDeleteExercise = (workoutId: string, exId: string) => {
    const updated = workouts.map((w) => {
      if (w.id === workoutId) {
        return { ...w, exercises: w.exercises.filter((e) => e.id !== exId) };
      }
      return w;
    });
    setWorkouts(updated);
    StorageService.saveWorkouts(updated);
  };

  const handleAddSet = (workoutId: string, exId: string) => {
    const updated = workouts.map((w) => {
      if (w.id === workoutId) {
        return {
          ...w,
          exercises: w.exercises.map((e) => {
            if (e.id === exId) {
              const lastSet = e.sets[e.sets.length - 1];
              const newSetNumber = e.sets.length + 1;
              return {
                ...e,
                sets: [
                  ...e.sets,
                  {
                    id: "s_" + Date.now(),
                    setNumber: newSetNumber,
                    weightKg: lastSet ? lastSet.weightKg : 60,
                    reps: lastSet ? lastSet.reps : 10,
                    completed: false,
                  },
                ],
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

  const handleUpdateSetWeight = (workoutId: string, exerciseId: string, setId: string, weightKg: number) => {
    const updated = workouts.map((w) => {
      if (w.id === workoutId) {
        return {
          ...w,
          exercises: w.exercises.map((e) => {
            if (e.id === exerciseId) {
              return {
                ...e,
                sets: e.sets.map((s) => (s.id === setId ? { ...s, weightKg } : s)),
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

  const handleUpdateSetReps = (workoutId: string, exerciseId: string, setId: string, reps: number) => {
    const updated = workouts.map((w) => {
      if (w.id === workoutId) {
        return {
          ...w,
          exercises: w.exercises.map((e) => {
            if (e.id === exerciseId) {
              return {
                ...e,
                sets: e.sets.map((s) => (s.id === setId ? { ...s, reps } : s)),
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

  const handleDeleteSet = (workoutId: string, exerciseId: string, setId: string) => {
    const updated = workouts.map((w) => {
      if (w.id === workoutId) {
        return {
          ...w,
          exercises: w.exercises.map((e) => {
            if (e.id === exerciseId) {
              return {
                ...e,
                sets: e.sets.filter((s) => s.id !== setId),
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

  const currentWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weightKg : 78.4;
  const startWeight = weightLogs.length > 0 ? weightLogs[0].weightKg : 79.2;
  const weightDelta = +(currentWeight - startWeight).toFixed(1);

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
              <div className="text-[10px] text-slate-400">Динамика и взвешивания</div>
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
              placeholder="Введи вес (кг)"
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

        {/* Mini History Bar Chart */}
        <div className="pt-2">
          <div className="flex items-end justify-between gap-1.5 h-14 px-1 border-b border-white/[0.04] pb-1">
            {weightLogs.slice(-7).map((log, idx, arr) => {
              const minW = Math.min(...weightLogs.map((l) => l.weightKg)) - 1;
              const maxW = Math.max(...weightLogs.map((l) => l.weightKg)) + 1;
              const hPercent = Math.max(
                20,
                Math.min(100, Math.round(((log.weightKg - minW) / Math.max(1, maxW - minW)) * 100))
              );
              const isLast = idx === arr.length - 1;
              return (
                <div key={log.id} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex justify-center items-end h-10">
                    <div
                      style={{ height: `${hPercent}%` }}
                      className={`w-full max-w-[24px] rounded-t-lg transition-all ${
                        isLast ? "bg-emerald-400" : "bg-white/[0.08]"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[9px] font-mono ${
                      isLast ? "text-emerald-400 font-bold" : "text-slate-500"
                    }`}
                  >
                    {log.weightKg}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Workout Sessions (Full User Control) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
            <span>Мои тренировочные дни</span>
          </div>
          <button
            onClick={() => setShowAddWorkout(true)}
            className="px-3 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Тренировка</span>
          </button>
        </div>

        {/* Modal: New Workout Day */}
        {showAddWorkout && (
          <div className="apple-card p-4 rounded-3xl space-y-2.5">
            <span className="text-xs font-bold text-white">Новый тренировочный день</span>
            <input
              type="text"
              placeholder="Название (например: Спина + Бицепс, Ноги, Пн)"
              value={newWorkoutName}
              onChange={(e) => setNewWorkoutName(e.target.value)}
              className="w-full bg-[#1b1f2a] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateWorkout}
                className="flex-1 py-1.5 bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs"
              >
                Создать день
              </button>
              <button
                onClick={() => setShowAddWorkout(false)}
                className="px-3 py-1.5 bg-white/[0.05] text-slate-400 rounded-xl text-xs"
              >
                Отмена
              </button>
            </div>
          </div>
        )}

        {workouts.map((workout) => (
          <div
            key={workout.id}
            className="apple-card p-4 rounded-3xl space-y-3.5"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-white tracking-tight">{workout.name}</h4>
                <p className="text-[10px] text-slate-400">
                  {workout.date} • {workout.exercises.length} упражнений
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveWorkoutForEx(workout.id)}
                  className="px-2.5 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-emerald-400 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Упражнение</span>
                </button>
                <button
                  onClick={() => handleDeleteWorkout(workout.id)}
                  className="p-1 rounded-full text-slate-500 hover:text-rose-400"
                  title="Удалить тренировку"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Add Exercise Modal / Input */}
            {activeWorkoutForEx === workout.id && (
              <div className="p-3 rounded-2xl bg-[#1b1f2a] space-y-2">
                <input
                  type="text"
                  placeholder="Название упражнения (Приседания, Жим, Подтягивания)"
                  value={newExName}
                  onChange={(e) => setNewExName(e.target.value)}
                  className="w-full bg-black/30 border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-white"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddExercise(workout.id)}
                    className="flex-1 py-1.5 bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs"
                  >
                    Добавить
                  </button>
                  <button
                    onClick={() => setActiveWorkoutForEx(null)}
                    className="px-3 py-1.5 bg-white/[0.05] text-slate-400 rounded-xl text-xs"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}

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
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAddSet(workout.id, ex.id)}
                        className="text-[10px] text-emerald-400 font-semibold hover:underline"
                      >
                        + Сет
                      </button>
                      <button
                        onClick={() => handleDeleteExercise(workout.id, ex.id)}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Sets List: Editable Weight & Reps */}
                  <div className="space-y-1.5 pt-1">
                    {ex.sets.map((s) => (
                      <div
                        key={s.id}
                        className={`p-2 rounded-2xl border flex items-center justify-between gap-2 transition-all ${
                          s.completed
                            ? "bg-emerald-500/[0.08] border-emerald-500/30 text-emerald-300"
                            : "bg-white/[0.03] border-white/[0.04] text-slate-300"
                        }`}
                      >
                        {/* Set badge */}
                        <span className="text-[10px] font-bold text-slate-400 w-12 flex-shrink-0">
                          Сет {s.setNumber}
                        </span>

                        {/* Weight input */}
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            step="0.5"
                            value={s.weightKg}
                            onChange={(e) =>
                              handleUpdateSetWeight(workout.id, ex.id, s.id, parseFloat(e.target.value) || 0)
                            }
                            className="w-14 bg-black/40 border border-white/[0.08] rounded-xl px-1.5 py-1 text-xs font-mono font-bold text-white text-center focus:border-emerald-500 focus:outline-none"
                          />
                          <span className="text-[10px] text-slate-400 font-mono">кг</span>
                        </div>

                        <span className="text-slate-600 font-bold">×</span>

                        {/* Reps input */}
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={s.reps}
                            onChange={(e) =>
                              handleUpdateSetReps(workout.id, ex.id, s.id, parseInt(e.target.value) || 0)
                            }
                            className="w-12 bg-black/40 border border-white/[0.08] rounded-xl px-1.5 py-1 text-xs font-mono font-bold text-white text-center focus:border-emerald-500 focus:outline-none"
                          />
                          <span className="text-[10px] text-slate-400 font-mono">повт</span>
                        </div>

                        {/* Complete & Delete buttons */}
                        <div className="flex items-center gap-1 ml-auto flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleSetComplete(workout.id, ex.id, s.id)}
                            className={`p-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1 ${
                              s.completed
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-white/[0.06] hover:bg-white/[0.1] text-slate-400 hover:text-white"
                            }`}
                            title={s.completed ? "Выполнено" : "Отметить выполненным"}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSet(workout.id, ex.id, s.id)}
                            className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Удалить подход"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
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
