"use client";

import React, { useState } from "react";
import { Headphones, MessageSquare, BookOpen, Languages, Plus } from "lucide-react";
import confetti from "canvas-confetti";

export const EnglishModule: React.FC = () => {
  const [totalWords, setTotalWords] = useState(480);
  const [minutesToday, setMinutesToday] = useState(25);
  const targetMinutes = 40;

  const handleAddWords = (count: number) => {
    setTotalWords((prev) => prev + count);
    confetti({ particleCount: 25, spread: 45, origin: { y: 0.7 } });
  };

  const handleAddMinutes = (min: number) => {
    setMinutesToday((prev) => prev + min);
  };

  const progressPercent = Math.min(100, Math.round((minutesToday / targetMinutes) * 100));

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Daily Study Target */}
      <div className="apple-card p-4 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                Ежедневная практика
              </span>
              <div className="text-xl font-mono font-bold text-white mt-0.5">
                {minutesToday} <span className="text-xs font-normal text-slate-400">/ {targetMinutes} мин</span>
              </div>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full">
            {progressPercent}%
          </span>
        </div>

        <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
          <div
            style={{ width: `${progressPercent}%` }}
            className="bg-sky-400 h-full rounded-full transition-all"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleAddMinutes(15)}
            className="flex-1 py-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-sky-300 text-xs font-bold active:scale-95 transition-all text-center"
          >
            +15 мин
          </button>
          <button
            onClick={() => handleAddMinutes(30)}
            className="flex-1 py-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-sky-300 text-xs font-bold active:scale-95 transition-all text-center"
          >
            +30 мин
          </button>
        </div>
      </div>

      {/* 2. Vocabulary Bank Card */}
      <div className="apple-card p-4 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-white tracking-tight">Словарный запас</h4>
            <span className="text-[10px] text-slate-400">Активно изученные слова</span>
          </div>
          <span className="text-sm font-mono font-bold text-sky-400">{totalWords} слов</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleAddWords(5)}
            className="py-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] text-xs font-semibold text-slate-200 active:scale-95 transition-all text-center"
          >
            +5 слов (Quizlet)
          </button>
          <button
            onClick={() => handleAddWords(15)}
            className="py-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] text-xs font-semibold text-slate-200 active:scale-95 transition-all text-center"
          >
            +15 слов (Урок)
          </button>
        </div>
      </div>

      {/* 3. Skill Areas */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
          Фокус по навыкам
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-2xl apple-card flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white">Listening</div>
              <div className="text-[10px] text-slate-400">Подкасты 20м</div>
            </div>
          </div>
          <div className="p-3 rounded-2xl apple-card flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white">Speaking</div>
              <div className="text-[10px] text-slate-400">Разговор 10м</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
