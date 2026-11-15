"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, CheckCircle2, Circle, Plus, Briefcase } from "lucide-react";
import confetti from "canvas-confetti";

interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  priority?: "high" | "normal";
}

export const WorkModule: React.FC = () => {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: "t1", title: "Сделать ревью Pull Request", completed: true, priority: "high" },
    { id: "t2", title: "Подготовить конспект по базам данных", completed: false, priority: "high" },
    { id: "t3", title: "Ответить на рабочие письма в Slack", completed: false },
  ]);
  const [newTaskText, setNewTaskText] = useState("");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      confetti({ particleCount: 35, spread: 50 });
      if (!isBreak) {
        setIsBreak(true);
        setSecondsLeft(5 * 60); // 5 min break
      } else {
        setIsBreak(false);
        setSecondsLeft(25 * 60);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft, isBreak]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    setTasks((prev) => [
      ...prev,
      { id: "t_" + Date.now(), title: newTaskText.trim(), completed: false },
    ]);
    setNewTaskText("");
  };

  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Pomodoro Focus Timer */}
      <div className="glass-card p-5 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/20 via-slate-900/60 to-slate-900/60 flex flex-col items-center text-center space-y-3">
        <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
          {isBreak ? "☕ Перерыв (Отдых)" : "🎯 Фокус-таймер (Pomodoro)"}
        </span>

        <div className="text-4xl font-mono font-black tracking-tight text-white">
          {formatTime(secondsLeft)}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-6 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 active:scale-95 transition-all"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? "Пауза" : "Старт фокуса"}</span>
          </button>
          <button
            onClick={() => {
              setIsRunning(false);
              setSecondsLeft(25 * 60);
              setIsBreak(false);
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Task Checklist */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            <span>Задачи дня (Фокус)</span>
          </div>
          <span className="text-[11px] text-slate-500">
            {tasks.filter((t) => t.completed).length} из {tasks.length}
          </span>
        </div>

        {/* Add Task Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Новая задача..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
          />
          <button
            onClick={handleAddTask}
            className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl text-xs active:scale-95 transition-all"
          >
            +
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-2 pt-1">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                task.completed
                  ? "bg-slate-900/40 border-white/5 text-slate-500"
                  : "bg-slate-900/80 border-white/10 text-slate-200 hover:border-indigo-500/40"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {task.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500" />
                )}
                <span className={`text-xs ${task.completed ? "line-through" : "font-medium"}`}>
                  {task.title}
                </span>
              </div>
              {task.priority === "high" && !task.completed && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Важно
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
