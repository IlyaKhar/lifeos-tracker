"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Flame, Plus, Sparkles } from "lucide-react";
import { AppIcon } from "@/components/common/AppIcon";

interface HeaderProps {
  activeModuleTitle?: string;
  activeModuleIcon?: string;
  userName?: string;
  onBack?: () => void;
  onOpenAddModule: () => void;
  onOpenProfile?: () => void;
  onOpenAI?: () => void;
  streakDays?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeModuleTitle,
  activeModuleIcon,
  userName = "Илья",
  onBack,
  onOpenAddModule,
  onOpenProfile,
  onOpenAI,
  streakDays = 12,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const todayFormatted = mounted
    ? new Intl.DateTimeFormat("ru-RU", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }).format(new Date())
    : "Сегодня";

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 pb-3 apple-nav">
      {activeModuleTitle ? (
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.08] active:scale-95 transition-all text-xs font-semibold text-slate-300"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Все сферы</span>
          </button>
          <div className="flex items-center gap-2">
            {activeModuleIcon && (
              <AppIcon name={activeModuleIcon} className="w-4 h-4 text-emerald-400" />
            )}
            <span className="text-sm font-bold tracking-tight text-white">
              {activeModuleTitle}
            </span>
          </div>
          {onOpenAI && (
            <button
              onClick={onOpenAI}
              className="px-2.5 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all"
              title="AI Коуч"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>AI</span>
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400 capitalize tracking-wide">
                {todayFormatted}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 text-[10px] font-bold">
                <Flame className="w-3 h-3 text-orange-400" />
                {streakDays} дн.
              </span>
            </div>
            <h1
              onClick={onOpenProfile}
              className="text-base font-bold tracking-tight text-white mt-0.5 cursor-pointer hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <span>Привет, {userName}</span>
              <span className="text-xs text-slate-500 font-normal">→ цели</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAI && (
              <button
                onClick={onOpenAI}
                className="px-2.5 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 active:scale-95 transition-all text-xs font-semibold flex items-center gap-1"
                title="AI Ассистент & Коуч"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Коуч</span>
              </button>
            )}
            <button
              onClick={onOpenAddModule}
              className="px-3 py-1.5 rounded-full bg-white text-slate-950 font-bold active:scale-95 transition-all text-xs flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Сфера</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
