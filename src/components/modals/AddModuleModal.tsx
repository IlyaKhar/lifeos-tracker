"use client";

import React, { useState } from "react";
import { X, Sparkles } from "lucide-react";
import { ModuleItem } from "@/types";
import confetti from "canvas-confetti";

interface AddModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddModule: (module: ModuleItem) => void;
}

const PRESET_ICONS = ["🎸", "🧘", "🚗", "💻", "🎨", "⚽", "🧠", "☕", "📈", "🕹️"];
const PRESET_COLORS = [
  { name: "Emerald", accent: "from-emerald-500/15 text-emerald-400", border: "border-emerald-500/30 hover:border-emerald-500" },
  { name: "Cyan", accent: "from-cyan-500/15 text-cyan-400", border: "border-cyan-500/30 hover:border-cyan-500" },
  { name: "Purple", accent: "from-purple-500/15 text-purple-400", border: "border-purple-500/30 hover:border-purple-500" },
  { name: "Rose", accent: "from-rose-500/15 text-rose-400", border: "border-rose-500/30 hover:border-rose-500" },
  { name: "Amber", accent: "from-amber-500/15 text-amber-400", border: "border-amber-500/30 hover:border-amber-500" },
];

export const AddModuleModal: React.FC<AddModuleModalProps> = ({ isOpen, onClose, onAddModule }) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [icon, setIcon] = useState("🎸");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newModule: ModuleItem = {
      id: "mod_" + Date.now(),
      title: title.trim(),
      subtitle: subtitle.trim() || "Личный трекер",
      category: "custom",
      icon,
      accentColor: selectedColor.accent,
      borderColor: selectedColor.border,
      previewValue: "0 записей",
      previewSubtext: "Только что создан",
      isCustom: true,
    };

    onAddModule(newModule);
    confetti({ particleCount: 40, spread: 60 });
    setTitle("");
    setSubtitle("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm glass-panel rounded-3xl border border-white/15 p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-100">Создать свой модуль</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Icon Selector */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
              Иконка
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_ICONS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setIcon(emoji)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                    icon === emoji
                      ? "bg-emerald-500/30 border border-emerald-500 scale-105"
                      : "bg-white/5 hover:bg-white/10 border border-white/5"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Название модуля
            </label>
            <input
              type="text"
              placeholder="Например: Гитара, Медитация, Бег"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Подзаголовок / описание
            </label>
            <input
              type="text"
              placeholder="Аккорды, практика 20 мин/день"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Color theme */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
              Цветовая тема
            </label>
            <div className="flex gap-2">
              {PRESET_COLORS.map((col) => (
                <button
                  type="button"
                  key={col.name}
                  onClick={() => setSelectedColor(col)}
                  className={`flex-1 py-1 rounded-xl text-[10px] font-bold border transition-all ${
                    selectedColor.name === col.name
                      ? "bg-white/20 border-white text-white"
                      : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {col.name}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-600 hover:to-emerald-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all mt-2"
          >
            Создать модуль
          </button>
        </form>
      </div>
    </div>
  );
};

