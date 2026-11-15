"use client";

import React, { useState } from "react";
import { Headphones, MessageSquare, BookOpen, PenTool, Plus, Check } from "lucide-react";
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
      <div className="glass-card p-4 rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-950/20 via-slate-900/60 to-slate-900/60 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
              Ежедневная практика
            </span>
            <div className="text-xl font-mono font-black text-white mt-0.5">
              {minutesToday} <span className="text-xs font-normal text-slate-400">/ {targetMinutes} мин</span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-1 rounded-lg border border-sky-500/30">
            {progressPercent}%
          </span>
        </div>

        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-white/5">
          <div
            style={{ width: `${progressPercent}%` }}
            className="bg-gradient-to-r from-sky-500 to-blue-400 h-full rounded-full transition-all"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleAddMinutes(15)}
            className="flex-1 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 text-xs font-bold active:scale-95 transition-all"
          >
            +15 мин
          </button>
          <button
            onClick={() => handleAddMinutes(30)}
            className="flex-1 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 text-xs font-bold active:scale-95 transition-all"
          >
            +30 мин
          </button>
        </div>
      </div>

      {/* 2. Vocabulary Bank Card */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-200">Словарный запас (Vocab)</h4>
            <span className="text-[10px] text-slate-400">Активно изученные слова</span>
          </div>
          <span className="text-sm font-mono font-black text-sky-400">{totalWords} слов</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleAddWords(5)}
            className="py-2 rounded-xl bg-white/5 hover:bg-sky-500/15 border border-white/5 hover:border-sky-500/30 text-xs font-bold text-slate-200 active:scale-95 transition-all"
          >
            +5 слов (Quizlet)
          </button>
          <button
            onClick={() => handleAddWords(15)}
            className="py-2 rounded-xl bg-white/5 hover:bg-sky-500/15 border border-white/5 hover:border-sky-500/30 text-xs font-bold text-slate-200 active:scale-95 transition-all"
          >
            +15 слов (Урок)
          </button>
        </div>
      </div>

      {/* 3. Skill Areas */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          Фокус по навыкам
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl glass-card border border-white/5 flex items-center gap-2.5">
            <Headphones className="w-4 h-4 text-sky-400" />
            <div>
              <div className="font-semibold text-slate-200">Listening</div>
              <div className="text-[10px] text-slate-400">Подкасты 20м</div>
            </div>
          </div>
          <div className="p-3 rounded-xl glass-card border border-white/5 flex items-center gap-2.5">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="font-semibold text-slate-200">Speaking</div>
              <div className="text-[10px] text-slate-400">Shadowing 10м</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

