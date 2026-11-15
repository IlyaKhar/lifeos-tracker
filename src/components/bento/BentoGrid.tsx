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
  onOpenEditCheckpoint: (cp: Checkpoint | null) => void;
  onDeleteCheckpoint?: (id: string) => void;
  onClearAllCheckpoints?: () => void;
}

const COLOR_CONFIGS: Record<string, { bg: string; text: string }> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  orange: { bg: "bg-orange-500/10", text: "text-orange-400" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-400" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400" },
  indigo: { bg: "bg-indigo-500/10", text: "text-indigo-400" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-400" },
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
  onOpenEditCheckpoint,
  onDeleteCheckpoint,
  onClearAllCheckpoints,
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
        onOpenEditCheckpoint={onOpenEditCheckpoint}
        onDeleteCheckpoint={onDeleteCheckpoint}
        onClearAllCheckpoints={onClearAllCheckpoints}
      />

      {/* 2. Apple Health Style Water Widget */}
      <div className="apple-card p-4 rounded-3xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white tracking-tight">Водный баланс</div>
            <div className="text-[11px] text-slate-400 font-mono">
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

      {/* 4. Bento Grid (Fixed Layout - No squished pills, Symmetrical Grid) */}
      <div className="grid grid-cols-2 gap-3">
        {modules.map((mod, index) => {
          // Gym is always full width; if last item is odd, make it full width too for perfect symmetry!
          const isGym = mod.category === "gym";
          const isLastOdd = index === modules.length - 1 && (modules.length - 1) % 2 !== 0;
          const isFullWidth = isGym || isLastOdd;

          const color = COLOR_CONFIGS[mod.accentColor] || COLOR_CONFIGS.emerald;

          if (isFullWidth) {
            return (
              <div
                key={mod.id}
                onClick={() => onSelectModule(mod)}
                className="col-span-2 p-4 rounded-3xl apple-card hover:bg-[#1a1e2a] transition-all cursor-pointer active:scale-[0.98] group flex flex-col justify-between min-h-[120px]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl ${color.bg} ${color.text} flex items-center justify-center flex-shrink-0`}>
                      <AppIcon name={mod.icon || mod.category} className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors tracking-tight">
                        {mod.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {mod.subtitle}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-200 bg-white/[0.05] px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                    {mod.previewValue}
                  </span>
                </div>

                <div className="pt-2.5 mt-2 border-t border-white/[0.04] flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[11px] font-medium text-slate-300 truncate pr-2">
                    {mod.previewSubtext}
                  </span>
                  <span className="w-6 h-6 rounded-full bg-white/[0.04] flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-white/[0.08] group-hover:translate-x-0.5 transition-all flex-shrink-0">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          }

          // 2-Column Compact Card (Clean vertical hierarchy: Icon left + Pill right, Title below)
          return (
            <div
              key={mod.id}
              onClick={() => onSelectModule(mod)}
              className="p-3.5 rounded-3xl apple-card hover:bg-[#1a1e2a] transition-all cursor-pointer active:scale-[0.98] group flex flex-col justify-between min-h-[145px]"
            >
              {/* Top Row: Icon + Value Badge on single line, never colliding */}
              <div className="flex items-center justify-between w-full">
                <div className={`w-8 h-8 rounded-2xl ${color.bg} ${color.text} flex items-center justify-center flex-shrink-0`}>
                  <AppIcon name={mod.icon || mod.category} className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-200 bg-white/[0.05] px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                  {mod.previewValue}
                </span>
              </div>

              {/* Middle Area: Title & Subtitle with full width */}
              <div className="my-1.5">
                <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors tracking-tight leading-snug">
                  {mod.title}
                </h3>
                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                  {mod.subtitle}
                </p>
              </div>

              {/* Bottom Footer */}
              <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs text-slate-400">
                <span className="text-[10px] font-medium text-slate-300 truncate pr-1">
                  {mod.previewSubtext}
                </span>
                <span className="w-5 h-5 rounded-full bg-white/[0.04] flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-white/[0.08] transition-all flex-shrink-0">
                  <ArrowRight className="w-3 h-3" />
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
