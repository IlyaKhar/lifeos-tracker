"use client";

import React from "react";
import { Checkpoint } from "@/types";
import { CheckCircle2, Circle, Trophy, Sparkles, SlidersHorizontal } from "lucide-react";
import confetti from "canvas-confetti";

interface CheckpointsWidgetProps {
  checkpoints: Checkpoint[];
  onToggleCheckpoint: (id: string) => void;
  onEditProfile: () => void;
}

export const CheckpointsWidget: React.FC<CheckpointsWidgetProps> = ({
  checkpoints,
  onToggleCheckpoint,
  onEditProfile,
}) => {
  const completedCount = checkpoints.filter((c) => c.completed).length;
  const total = checkpoints.length;
  const progressPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const handleToggle = (cp: Checkpoint) => {
    if (!cp.completed) {
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.7 } });
    }
    onToggleCheckpoint(cp.id);
  };

  return (
    <div className="glass-card p-4 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-slate-900/60 to-slate-900/60 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              <span>Дорожная карта & Чекпоинты</span>
              {progressPercent === 100 && <span className="text-amber-400">🎉</span>}
            </h3>
            <p className="text-[10px] text-slate-400">
              {completedCount} из {total} этапов пройдено ({progressPercent}%)
            </p>
          </div>
        </div>

        <button
          onClick={onEditProfile}
          className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all text-[10px] flex items-center gap-1"
          title="Настроить цели и параметры"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
          <span>Цели</span>
        </button>
      </div>

      {/* Main Roadmap Progress Bar */}
      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-white/5">
        <div
          style={{ width: `${progressPercent}%` }}
          className="bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400 h-full rounded-full transition-all duration-300"
        />
      </div>

      {/* Checkpoints Scrollable / Stack List */}
      <div className="space-y-2 pt-1">
        {checkpoints.map((cp) => (
          <div
            key={cp.id}
            onClick={() => handleToggle(cp)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
              cp.completed
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                : "bg-slate-900/60 border-white/5 text-slate-200 hover:border-white/15"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-lg flex-shrink-0">{cp.badge}</span>
              <div className="min-w-0">
                <div
                  className={`text-xs font-bold truncate ${
                    cp.completed ? "line-through opacity-80 text-emerald-300" : "text-slate-100"
                  }`}
                >
                  {cp.title}
                </div>
                <div className="text-[10px] text-slate-400 truncate">{cp.description}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {cp.completed ? (
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Взято</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-white">
                  <Circle className="w-3.5 h-3.5" />
                  <span>Выполнить</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
