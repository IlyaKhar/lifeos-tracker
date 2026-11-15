"use client";

import React from "react";
import { ArrowLeft, Flame, Plus } from "lucide-react";

interface HeaderProps {
  activeModuleTitle?: string;
  onBack?: () => void;
  onOpenQuickAction: () => void;
  onOpenAddModule: () => void;
  streakDays?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeModuleTitle,
  onBack,
  onOpenQuickAction,
  onOpenAddModule,
  streakDays = 12,
}) => {
  const todayFormatted = new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date());

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 pb-3 glass-panel border-b border-white/10">
      {activeModuleTitle ? (
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-xs font-semibold text-emerald-400"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Все модули</span>
          </button>
          <span className="text-sm font-bold tracking-wide text-slate-100">
            {activeModuleTitle}
          </span>
          <button
            onClick={onOpenQuickAction}
            className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold hover:bg-emerald-500/30 active:scale-95 transition-all"
            title="Быстрый ввод"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-400 capitalize">
                {todayFormatted}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                <Flame className="w-3 h-3 text-amber-500" />
                {streakDays} дн.
              </span>
            </div>
            <h1 className="text-lg font-extrabold tracking-tight text-white mt-0.5">
              Мой Хаб ⚡
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddModule}
              className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-white/10 active:scale-95 transition-all text-xs font-medium text-slate-200 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Модуль</span>
            </button>
            <button
              onClick={onOpenQuickAction}
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-lg shadow-emerald-500/20 flex items-center justify-center font-bold hover:scale-105 active:scale-95 transition-all"
              title="Быстрый ввод"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
