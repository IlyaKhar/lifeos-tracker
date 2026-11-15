"use client";

import React, { useState, useEffect } from "react";
import { Checkpoint, ModuleCategory } from "@/types";
import { X, Trash2, CheckCircle2, Circle, Sparkles, Layers, Dumbbell, Wallet, Languages, BookOpen, Scale, Trophy, Flame } from "lucide-react";
import { AppIcon } from "@/components/common/AppIcon";

interface EditCheckpointModalProps {
  isOpen: boolean;
  checkpoint: Checkpoint | null; // null if creating a new one
  onClose: () => void;
  onSave: (cp: Checkpoint) => void;
  onDelete?: (id: string) => void;
  onToggleComplete?: (id: string) => void;
}

const BADGE_OPTIONS = [
  { id: "trophy", label: "Трофей" },
  { id: "dumbbell", label: "Зал" },
  { id: "scale", label: "Вес" },
  { id: "wallet", label: "Финансы" },
  { id: "layers", label: "3D" },
  { id: "languages", label: "Язык" },
  { id: "book-open", label: "Книги" },
  { id: "sparkles", label: "Цель" },
  { id: "flame", label: "Стрик" },
];

export const EditCheckpointModal: React.FC<EditCheckpointModalProps> = ({
  isOpen,
  checkpoint,
  onClose,
  onSave,
  onDelete,
  onToggleComplete,
}) => {
  const isNew = !checkpoint;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [badge, setBadge] = useState("trophy");
  const [category, setCategory] = useState<ModuleCategory>("gym");
  const [targetValue, setTargetValue] = useState<string>("1");
  const [unit, setUnit] = useState("раз");

  useEffect(() => {
    if (checkpoint) {
      setTitle(checkpoint.title);
      setDescription(checkpoint.description);
      setBadge(checkpoint.badge || "trophy");
      setCategory(checkpoint.category);
      setTargetValue(checkpoint.targetValue?.toString() || "1");
      setUnit(checkpoint.unit || "");
    } else {
      setTitle("");
      setDescription("");
      setBadge("trophy");
      setCategory("gym");
      setTargetValue("1");
      setUnit("раз");
    }
  }, [checkpoint, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const cp: Checkpoint = {
      id: checkpoint ? checkpoint.id : "cp_" + Date.now(),
      title: title.trim(),
      description: description.trim(),
      badge,
      category,
      currentValue: checkpoint ? checkpoint.currentValue : 0,
      targetValue: parseFloat(targetValue) || 1,
      unit: unit.trim(),
      completed: checkpoint ? checkpoint.completed : false,
      createdAt: checkpoint ? checkpoint.createdAt : new Date().toISOString(),
    };

    onSave(cp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md apple-card rounded-3xl p-5 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <AppIcon name={badge} className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                {isNew ? "Новый чекпоинт" : "Редактирование цели"}
              </h3>
              <p className="text-[10px] text-slate-400">
                {isNew ? "Создай свой этап" : "Измени название и описание"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Toggle if existing */}
        {checkpoint && (
          <div className="p-3 rounded-2xl bg-[#1b1f2a] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300">Статус чекпоинта:</span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  checkpoint.completed
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-white/[0.06] text-slate-400"
                }`}
              >
                {checkpoint.completed ? "Выполнено ✓" : "В процессе"}
              </span>
            </div>
            {onToggleComplete && (
              <button
                type="button"
                onClick={() => {
                  onToggleComplete(checkpoint.id);
                  onClose();
                }}
                className="text-xs font-bold text-emerald-400 hover:underline"
              >
                {checkpoint.completed ? "Снять отметку" : "Отметить готовым"}
              </button>
            )}
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Badge Icon Selector */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
              Иконка этапа
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {BADGE_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setBadge(opt.id)}
                  className={`h-9 rounded-2xl flex items-center justify-center transition-all ${
                    badge === opt.id
                      ? "bg-emerald-400 text-slate-950 font-bold scale-105 shadow-sm"
                      : "bg-white/[0.04] hover:bg-white/[0.08] text-slate-300"
                  }`}
                  title={opt.label}
                >
                  <AppIcon name={opt.id} className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Название чекпоинта
            </label>
            <input
              type="text"
              placeholder="Например: Первые 25% на «Пассат Б6»"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#1b1f2a] border border-white/[0.08] focus:border-emerald-500 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              required
            />
          </div>

          {/* Description (Full text, multiline capable) */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Полное описание и детали
            </label>
            <textarea
              rows={3}
              placeholder="Подробное описание: что нужно сделать, какая сумма или вес..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#1b1f2a] border border-white/[0.08] focus:border-emerald-500 rounded-2xl px-3.5 py-2 text-xs text-white focus:outline-none resize-none"
            />
          </div>

          {/* Target Value & Unit */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Целевое значение
              </label>
              <input
                type="number"
                step="any"
                placeholder="100"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="w-full bg-[#1b1f2a] border border-white/[0.08] rounded-2xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Единица (₽, кг, раз, стр)
              </label>
              <input
                type="text"
                placeholder="₽"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-[#1b1f2a] border border-white/[0.08] rounded-2xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            {!isNew && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm("Точно удалить этот чекпоинт?")) {
                    onDelete(checkpoint.id);
                    onClose();
                  }
                }}
                className="p-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                title="Удалить чекпоинт"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              className="flex-1 py-2.5 bg-white text-slate-950 font-bold rounded-2xl text-xs shadow-md hover:bg-slate-100 active:scale-95 transition-all text-center"
            >
              {isNew ? "Создать чекпоинт" : "Сохранить изменения"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
