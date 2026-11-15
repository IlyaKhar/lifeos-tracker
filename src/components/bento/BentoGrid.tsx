"use client";

import React from "react";
import { ModuleItem } from "@/types";
import { ArrowRight, Droplets, Plus, CheckCircle2, Circle } from "lucide-react";

interface BentoGridProps {
  modules: ModuleItem[];
  waterMl: number;
  onAddWater: (amountMl: number) => void;
  onSelectModule: (module: ModuleItem) => void;
  onOpenAddModule: () => void;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  modules,
  waterMl,
  onAddWater,
  onSelectModule,
  onOpenAddModule,
}) => {
  const targetWater = 2500;
  const waterPercent = Math.min(100, Math.round((waterMl / targetWater) * 100));

  return (
    <div className="space-y-4">
      {/* Quick Water Widget */}
      <div className="glass-card p-3.5 rounded-2xl flex items-center justify-between border border-blue-500/20 bg-gradient-to-r from-blue-950/30 via-slate-900/60 to-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Droplets className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200">Водный баланс</div>
            <div className="text-[11px] text-slate-400">
              <span className="font-bold text-blue-400">{(waterMl / 1000).toFixed(2)}</span> / {(targetWater / 1000).toFixed(1)} л ({waterPercent}%)
            </div>
          </div>
        </div>
        <button
          onClick={() => onAddWater(250)}
          className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-300 text-xs font-bold active:scale-95 transition-all flex items-center gap-1 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>250 мл</span>
        </button>
      </div>

      {/* Bento Grid Header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Сферы & Модули
        </span>
        <span className="text-[11px] text-slate-500">Нажми, чтобы открыть</span>
      </div>

      {/* Grid of Bento Rectangles */}
      <div className="grid grid-cols-2 gap-3">
        {modules.map((mod, index) => {
          const isGym = mod.category === "gym";
          return (
            <div
              key={mod.id}
              onClick={() => onSelectModule(mod)}
              className={`p-4 rounded-2xl glass-card border transition-all cursor-pointer active:scale-[0.98] group relative overflow-hidden flex flex-col justify-between ${
                isGym ? "col-span-2 min-h-[140px]" : "min-h-[135px]"
              } ${mod.borderColor}`}
            >
              {/* Subtle Ambient Glow */}
              <div
                className={`absolute -right-8 -bottom-8 w-28 h-28 rounded-full blur-2xl opacity-15 bg-gradient-to-br ${mod.accentColor} pointer-events-none`}
              />

              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl p-2 rounded-xl bg-white/5 border border-white/5">
                      {mod.icon}
                    </span>
                    <div>
                      <h3 className="font-bold text-sm text-slate-100 group-hover:text-emerald-400 transition-colors">
                        {mod.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 line-clamp-1">
                        {mod.subtitle}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-200 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                    {mod.previewValue}
                  </span>
                </div>
              </div>

              {/* Card Footer / Preview Pill */}
              <div className="pt-3 mt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px] font-medium text-slate-300 truncate pr-2">
                  {mod.previewSubtext}
                </span>
                <span className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-white/10 group-hover:translate-x-0.5 transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}

        {/* Add Custom Module Card */}
        <div
          onClick={onOpenAddModule}
          className="col-span-2 p-3.5 rounded-2xl border border-dashed border-white/15 hover:border-emerald-500/50 hover:bg-white/5 cursor-pointer transition-all flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 active:scale-[0.99]"
        >
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Plus className="w-4 h-4" />
          </div>
          <span>Создать свой модуль (Учеба, Гитара, Авто...)</span>
        </div>
      </div>
    </div>
  );
};
