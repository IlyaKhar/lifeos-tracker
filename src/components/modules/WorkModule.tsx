"use client";

import React, { useState, useEffect } from "react";
import { WorkTask } from "@/types";
import { StorageService } from "@/lib/storage";
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  Plus,
  Briefcase,
  Coffee,
  Target,
  Trash2,
  Calendar,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import confetti from "canvas-confetti";

export const WorkModule: React.FC = () => {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  // Tasks state
  const [tasks, setTasks] = useState<WorkTask[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDue, setNewTaskDue] = useState("Сегодня");
  const [newTaskPriority, setNewTaskPriority] = useState<"high" | "normal">("normal");
  const [newTaskCategory, setNewTaskCategory] = useState<"study" | "work" | "general">("work");

  useEffect(() => {
    setTasks(StorageService.getWorkTasks());
  }, []);

  // Pomodoro Timer
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
        setSecondsLeft(5 * 60);
      } else {
        setIsBreak(false);
        setSecondsLeft(25 * 60);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft, isBreak]);

  const toggleTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task && !task.completed) {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    }
    const updated = StorageService.toggleWorkTask(id);
    setTasks(updated);
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const task: WorkTask = {
      id: "wt_" + Date.now(),
      title: newTaskTitle.trim(),
      completed: false,
      priority: newTaskPriority,
      dueDate: newTaskDue.trim() || undefined,
      category: newTaskCategory,
      createdAt: new Date().toISOString(),
    };
    const updated = StorageService.addWorkTask(task);
    setTasks(updated);
    setNewTaskTitle("");
    setShowAddForm(false);
  };

  const handleDeleteTask = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = StorageService.deleteWorkTask(id);
    setTasks(updated);
  };

  const handleClearCompleted = () => {
    const uncompleted = tasks.filter((t) => !t.completed);
    StorageService.saveWorkTasks(uncompleted);
    setTasks(uncompleted);
  };

  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Pomodoro Focus Timer */}
      <div className="apple-card p-6 rounded-3xl flex flex-col items-center text-center space-y-3">
        <div className="flex items-center gap-2">
          {isBreak ? (
            <div className="w-8 h-8 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Coffee className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          )}
          <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
            {isBreak ? "Перерыв (Отдых 5 мин)" : "Фокус-таймер (Pomodoro 25 мин)"}
          </span>
        </div>

        <div className="text-4xl font-mono font-bold tracking-tight text-white">
          {formatTime(secondsLeft)}
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-6 py-2 rounded-full bg-white text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow active:scale-95 transition-all"
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
            className="p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 transition-colors"
            title="Сбросить таймер"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Tasks & Deadlines Checklist */}
      <div className="apple-card p-4 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
            <span>Задачи & Сроки</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-mono">
              {completedCount} из {tasks.length}
            </span>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Задача</span>
            </button>
          </div>
        </div>

        {/* Add Task Form with Deadlines and Priority */}
        {showAddForm && (
          <div className="p-3.5 rounded-2xl bg-[#1b1f2a] border border-indigo-500/30 space-y-2.5">
            <span className="text-xs font-bold text-white">Новая задача со сроком</span>
            <input
              type="text"
              placeholder="Что нужно сделать (например: Сдать курсач, Дописать модуль)"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              className="w-full bg-black/30 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white"
            />

            {/* Quick Due Date selector */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400">Срок выполнения (дедлайн):</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {["Сегодня", "Завтра", "До конца недели", "Без срока"].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setNewTaskDue(d)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-semibold transition-all ${
                      newTaskDue === d
                        ? "bg-indigo-500 text-white font-bold"
                        : "bg-white/[0.04] text-slate-400 hover:text-white"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority & Category */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Приоритет:</span>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as any)}
                  className="w-full bg-black/30 border border-white/[0.08] rounded-xl px-2 py-1.5 text-xs text-white"
                >
                  <option value="normal">Обычный</option>
                  <option value="high">🔥 Срочно / Важно</option>
                </select>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Категория:</span>
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value as any)}
                  className="w-full bg-black/30 border border-white/[0.08] rounded-xl px-2 py-1.5 text-xs text-white"
                >
                  <option value="work">💼 Работа</option>
                  <option value="study">🎓 Учеба</option>
                  <option value="general">🎯 Личное</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-1.5 bg-white/[0.06] text-slate-300 font-semibold rounded-xl text-xs"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleAddTask}
                className="flex-1 py-1.5 bg-indigo-500 text-white font-bold rounded-xl text-xs active:scale-95 transition-all shadow-md"
              >
                Добавить
              </button>
            </div>
          </div>
        )}

        {/* Task List */}
        {tasks.length === 0 ? (
          <div className="text-center py-6 space-y-1">
            <p className="text-xs text-slate-400">Список задач пуст</p>
            <p className="text-[10px] text-slate-500">Добавь первую задачу по учебе или работе</p>
          </div>
        ) : (
          <div className="space-y-2 pt-1">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                  task.completed
                    ? "bg-white/[0.02] text-slate-500"
                    : "bg-white/[0.04] text-slate-200 hover:bg-white/[0.07]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="flex-shrink-0">
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span
                      className={`text-xs block truncate ${
                        task.completed ? "line-through text-slate-500" : "font-medium text-white"
                      }`}
                    >
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      {task.dueDate && (
                        <span className="text-[10px] text-indigo-400 flex items-center gap-1 font-mono">
                          <Calendar className="w-2.5 h-2.5" />
                          {task.dueDate}
                        </span>
                      )}
                      {task.category && (
                        <span className="text-[9px] text-slate-400 font-mono">
                          {task.category === "study"
                            ? "🎓 Учеба"
                            : task.category === "work"
                            ? "💼 Работа"
                            : "🎯 Личное"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {task.priority === "high" && !task.completed && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300">
                      Важно
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteTask(e, task.id)}
                    className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Удалить задачу"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Clear Completed Tasks */}
        {completedCount > 0 && (
          <div className="pt-2 border-t border-white/[0.04] flex justify-end">
            <button
              onClick={handleClearCompleted}
              className="text-[10px] text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Очистить выполненные ({completedCount})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
