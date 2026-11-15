"use client";

import React, { useState } from "react";
import { X, Sparkles, Music, Car, Code2, Heart, Activity, Dumbbell, Wallet, BookOpen, Layers, Flame, Trophy } from "lucide-react";
import { ModuleItem } from "@/types";
import { AppIcon } from "@/components/common/AppIcon";
import confetti from "canvas-confetti";

interface AddModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddModule: (module: ModuleItem) => void;
}

const PRESET_ICONS = [
  { id: "music", label: "Музыка" },
  { id: "car", label: "Авто" },
  { id: "code", label: "Код" },
  { id: "activity", label: "Здоровье" },
  { id: "heart", label: "Привычки" },
  { id: "dumbbell", label: "Спорт" },
  { id: "layers", label: "3D/Крафт" },
  { id: "wallet", label: "Финансы" },
  { id: "book-open", label: "Учеба" },
  { id: "flame", label: "Стрик" },
];

const PRESET_COLORS = [
  { name: "emerald", label: "Мята" },
  { name: "orange", label: "Оранж" },
  { name: "amber", label: "Золото" },
  { name: "sky", label: "Лазурь" },
  { name: "purple", label: "Индиго" },
  { name: "indigo", label: "Кобальт" },
];

export const AddModuleModal: React.FC<AddModuleModalProps> = ({ isOpen, onClose, onAddModule }) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("music");
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
      icon: selectedIcon,
      accentColor: selectedColor.name,
      borderColor: "border-white/[0.06]",
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
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm apple-card rounded-3xl p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">Добавить сферу</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Icon Selector (Vector Icons) */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
              Иконка сферы
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {PRESET_ICONS.map((it) => (
                <button
                  type="button"
                  key={it.id}
                  onClick={() => setSelectedIcon(it.id)}
                  className={`h-10 rounded-2xl flex items-center justify-center transition-all ${
                    selectedIcon === it.id
                      ? "bg-emerald-400 text-slate-950 font-bold scale-105 shadow-sm"
                      : "bg-white/[0.04] hover:bg-white/[0.08] text-slate-300"
                  }`}
                  title={it.label}
                >
                  <AppIcon name={it.id} className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Название
            </label>
            <input
              type="text"
              placeholder="Гитара, Медитация, Бег"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#1b1f2a] border border-white/[0.08] rounded-2xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Краткое описание
            </label>
            <input
              type="text"
              placeholder="Аккорды, практика 20 мин в день"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-[#1b1f2a] border border-white/[0.08] rounded-2xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Color theme */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
              Цветовой акцент
            </label>
            <div className="grid grid-cols-6 gap-1.5">
              {PRESET_COLORS.map((col) => (
                <button
                  type="button"
                  key={col.name}
                  onClick={() => setSelectedColor(col)}
                  className={`py-1 rounded-xl text-[10px] font-semibold border transition-all text-center ${
                    selectedColor.name === col.name
                      ? "bg-white/[0.15] border-white text-white"
                      : "bg-white/[0.03] border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  {col.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-white text-slate-950 font-bold rounded-2xl text-xs shadow-md hover:bg-slate-100 active:scale-95 transition-all mt-2"
          >
            Создать сферу
          </button>
        </form>
      </div>
    </div>
  );
};
