"use client";

import React from "react";
import { ModuleItem, Checkpoint } from "@/types";
import { ArrowRight, Droplets, Plus } from "lucide-react";
import { AppIcon } from "@/components/common/AppIcon";
import { CheckpointsWidget } from "@/components/roadmap/CheckpointsWidget";

interface BentoGridProps {
  modules: ModuleItem[];
  waterMl: number;
  checkpoints: Checkpoint[];
  onAddWater: (amountMl: number) => void;
  onSelectModule: (module: ModuleItem) => void;
  onOpenAddModule: () => void;
  onToggleCheckpoint: (id: string) => void;
  onEditProfile: () => void;
}

const COLOR_CONFIGS: Record<string, { bg: string; text: string }> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  orange: { bg: "bg-orange-500/10", text: "text-orange-400" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-400" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400" },
  indigo: { bg: "bg-indigo-500/10", text: "text-indigo-400" },
};

export const BentoGrid: React.FC<BentoGridProps> = ({
  modules,
  waterMl,
  checkpoints,
  onAddWater,
  onSelectModule,
  onOpenAddModule,
  onToggleCheckpoint,
  onEditProfile,
}) => {
  const targetWater = 2500;
  const waterPercent = Math.min(100, Math.round((waterMl / targetWater) * 100));

  return (
    <div className="space-y-4">
      {/* 1. Smart Checkpoints Roadmap */}
      <CheckpointsWidget
        checkpoints={checkpoints}
        onToggleCheckpoint={onToggleCheckpoint}
        onEditProfile={onEditProfile}
      />

      {/* 2. Apple Health Style Water Widget */}
      <div className="apple-card p-4 rounded-3xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white tracking-tight">Водный баланс</div>
            <div className="text-[11px] text-slate-400">
              <span className="font-semibold text-blue-400">{(waterMl / 1000).toFixed(2)}</span> / {(targetWater / 1000).toFixed(1)} л ({waterPercent}%)
            </div>
          </div>
        </div>
        <button
          onClick={() => onAddWater(250)}
          className="px-3.5 py-1.5 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-bold active:scale-95 transition-all flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>250 мл</span>
        </button>
      </div>

      {/* 3. Section Title */}
      <div className="flex items-center justify-between px-1 pt-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Сферы жизни
        </span>
        <span className="text-[11px] text-slate-500">Нажми для перехода</span>
      </div>

      {/* 4. Bento Grid (Apple Matte Style) */}
      <div className="grid grid-cols-2 gap-3">
        {modules.map((mod) => {
          const isGym = mod.category === "gym";
          const color = COLOR_CONFIGS[mod.accentColor] || COLOR_CONFIGS.emerald;

          return (
            <div
              key={mod.id}
              onClick={() => onSelectModule(mod)}
              className={`p-4 rounded-3xl apple-card hover:bg-[#1a1e2a] transition-all cursor-pointer active:scale-[0.98] group flex flex-col justify-between ${
                isGym ? "col-span-2 min-h-[135px]" : "min-h-[135px]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-2xl ${color.bg} ${color.text} flex items-center justify-center`}>
                      <AppIcon name={mod.icon || mod.category} className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors tracking-tight">
                        {mod.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 line-clamp-1">
                        {mod.subtitle}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-200 bg-white/[0.04] px-2 py-1 rounded-xl">
                    {mod.previewValue}
                  </span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 mt-2 border-t border-white/[0.04] flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px] font-medium text-slate-300 truncate pr-2">
                  {mod.previewSubtext}
                </span>
                <span className="w-6 h-6 rounded-full bg-white/[0.04] flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-white/[0.08] group-hover:translate-x-0.5 transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}

        {/* Add Module Card */}
        <div
          onClick={onOpenAddModule}
          className="col-span-2 p-3.5 rounded-3xl border border-dashed border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.02] cursor-pointer transition-all flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 hover:text-white active:scale-[0.99]"
        >
          <div className="w-6 h-6 rounded-full bg-white/[0.06] text-white flex items-center justify-center font-bold">
            <Plus className="w-3.5 h-3.5" />
          </div>
          <span>Добавить новую сферу</span>
        </div>
      </div>
    </div>
  );
};
