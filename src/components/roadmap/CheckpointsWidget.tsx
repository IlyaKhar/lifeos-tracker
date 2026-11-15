"use client";

import React from "react";
import { Checkpoint } from "@/types";
import { CheckCircle2, Circle, Trophy, SlidersHorizontal, Plus, ChevronRight } from "lucide-react";
import { AppIcon } from "@/components/common/AppIcon";
import confetti from "canvas-confetti";

interface CheckpointsWidgetProps {
  checkpoints: Checkpoint[];
  onToggleCheckpoint: (id: string) => void;
  onEditProfile: () => void;
  onOpenEditCheckpoint: (cp: Checkpoint | null) => void;
}

export const CheckpointsWidget: React.FC<CheckpointsWidgetProps> = ({
  checkpoints,
  onToggleCheckpoint,
  onEditProfile,
  onOpenEditCheckpoint,
}) => {
  const completedCount = checkpoints.filter((c) => c.completed).length;
  const total = checkpoints.length;
  const progressPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const handleToggle = (e: React.MouseEvent, cp: Checkpoint) => {
    e.stopPropagation();
    if (!cp.completed) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    }
    onToggleCheckpoint(cp.id);
  };

  return (
    <div className="apple-card p-4 rounded-3xl space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-tight">
              Дорожная карта & Чекпоинты
            </h3>
            <p className="text-[10px] text-slate-400">
              {completedCount} из {total} целей выполнено ({progressPercent}%)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onOpenEditCheckpoint(null)}
            className="p-1 px-2.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-all text-[11px] font-semibold flex items-center gap-1"
            title="Добавить свой чекпоинт"
          >
            <Plus className="w-3 h-3" />
            <span>Этап</span>
          </button>
          <button
            onClick={onEditProfile}
            className="p-1 px-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.09] text-slate-300 transition-all text-[11px] font-semibold flex items-center gap-1"
            title="Настроить цели"
          >
            <SlidersHorizontal className="w-3 h-3 text-slate-400" />
            <span>Цели</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
        <div
          style={{ width: `${progressPercent}%` }}
          className="bg-emerald-400 h-full rounded-full transition-all duration-300"
        />
      </div>

      {/* Checkpoints List (Full text, tap to open / edit) */}
      <div className="space-y-2 pt-1">
        {checkpoints.map((cp) => (
          <div
            key={cp.id}
            onClick={() => onOpenEditCheckpoint(cp)}
            className={`p-3.5 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 group ${
              cp.completed
                ? "bg-emerald-500/[0.07] border border-emerald-500/20"
                : "bg-white/[0.03] hover:bg-white/[0.06] border border-transparent"
            }`}
          >
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div
                className={`w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  cp.completed ? "bg-emerald-500/20 text-emerald-300" : "bg-white/[0.06] text-slate-300"
                }`}
              >
                <AppIcon name={cp.badge} className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div
                  className={`text-xs font-bold leading-snug break-words ${
                    cp.completed ? "line-through opacity-70 text-emerald-300" : "text-white"
                  }`}
                >
                  {cp.title}
                </div>
                {cp.description && (
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-relaxed break-words">
                    {cp.description}
                  </div>
                )}
              </div>
            </div>

            {/* Complete status button */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={(e) => handleToggle(e, cp)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all active:scale-95 flex items-center gap-1 ${
                  cp.completed
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-white/[0.06] hover:bg-white/[0.1] text-slate-300"
                }`}
              >
                {cp.completed ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Взято</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-3 h-3 text-slate-400" />
                    <span>Взять</span>
                  </>
                )}
              </button>
              <span className="text-slate-500 group-hover:text-slate-300 transition-colors">
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
