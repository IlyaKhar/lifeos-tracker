"use client";

import React, { useState, useEffect } from "react";
import { FilamentSpool, PrintJob } from "@/types";
import { StorageService } from "@/lib/storage";
import {
  Printer,
  Layers,
  Thermometer,
  Clock,
  Plus,
  Coins,
  CheckCircle,
  AlertTriangle,
  Wrench,
} from "lucide-react";

export const Print3DModule: React.FC = () => {
  const [spools, setSpools] = useState<FilamentSpool[]>([]);
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([]);
  const [showAddSpool, setShowAddSpool] = useState(false);

  // New Spool Form State
  const [newBrand, setNewBrand] = useState("");
  const [newMaterial, setNewMaterial] = useState<FilamentSpool["material"]>("PLA");
  const [newColor, setNewColor] = useState("");
  const [newColorHex, setNewColorHex] = useState("#f97316");

  useEffect(() => {
    setSpools(StorageService.getSpools());
    setPrintJobs(StorageService.getPrintJobs());
  }, []);

  const handleAddSpool = () => {
    if (!newBrand || !newColor) return;
    const spool: FilamentSpool = {
      id: "sp_" + Date.now(),
      brand: newBrand,
      material: newMaterial,
      colorName: newColor,
      colorHex: newColorHex,
      totalWeightGrams: 1000,
      remainingWeightGrams: 1000,
      nozzleTemp: newMaterial === "PETG" ? 235 : newMaterial === "ABS" ? 245 : 210,
      bedTemp: newMaterial === "PETG" ? 80 : newMaterial === "ABS" ? 100 : 60,
      priceRub: 1300,
    };
    const updated = [...spools, spool];
    setSpools(updated);
    StorageService.saveSpools(updated);
    setShowAddSpool(false);
    setNewBrand("");
    setNewColor("");
  };

  const activeJob = printJobs.find((j) => j.status === "printing");
  const queuedJobs = printJobs.filter((j) => j.status === "queued");

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Active Print Job Hero Card */}
      {activeJob && (
        <div className="glass-card p-4 rounded-2xl border border-orange-500/40 bg-gradient-to-br from-orange-950/30 via-slate-900/60 to-slate-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center animate-pulse">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">
                  Идет печать...
                </span>
                <h3 className="font-bold text-sm text-slate-100">{activeJob.title}</h3>
              </div>
            </div>
            <span className="text-sm font-mono font-black text-orange-400">
              {activeJob.progressPercent}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-white/5">
              <div
                style={{ width: `${activeJob.progressPercent}%` }}
                className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all"
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                Осталось: ~1ч 15м
              </span>
              <span className="flex items-center gap-1">
                <Coins className="w-3 h-3 text-amber-500" />
                {activeJob.costRub} ₽ ({activeJob.weightGrams} г)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Filament Inventory Card */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">Склад катушек (Филамент)</h4>
              <p className="text-[10px] text-slate-400">{spools.length} катушки в наличии</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddSpool(!showAddSpool)}
            className="px-2.5 py-1 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 text-xs font-bold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Катушка</span>
          </button>
        </div>

        {/* Add Spool Form Modal */}
        {showAddSpool && (
          <div className="p-3 rounded-xl bg-slate-900 border border-orange-500/40 space-y-2">
            <div className="text-xs font-bold text-slate-200">Новая катушка</div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Бренд (Kingroon, eSUN)"
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
              />
              <select
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
              >
                <option value="PLA">PLA</option>
                <option value="PETG">PETG</option>
                <option value="ABS">ABS</option>
                <option value="TPU">TPU</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Цвет (Black, Neon Green)"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
              />
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="w-8 h-7 rounded border-none bg-transparent cursor-pointer"
                />
                <button
                  onClick={handleAddSpool}
                  className="flex-1 py-1 bg-orange-500 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Добавить
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Spools List */}
        <div className="space-y-2">
          {spools.map((sp) => {
            const pct = Math.round((sp.remainingWeightGrams / sp.totalWeightGrams) * 100);
            return (
              <div
                key={sp.id}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    style={{ backgroundColor: sp.colorHex }}
                    className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-200">
                      {sp.brand} <span className="text-orange-400">{sp.material}</span> ({sp.colorName})
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2">
                      <span className="flex items-center gap-0.5">
                        <Thermometer className="w-2.5 h-2.5" />
                        {sp.nozzleTemp}°C / {sp.bedTemp}°C
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-slate-200">
                    {sp.remainingWeightGrams} <span className="text-slate-400 text-[10px]">/ 1000 г</span>
                  </div>
                  <div className="w-20 bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div
                      style={{ width: `${pct}%`, backgroundColor: sp.colorHex }}
                      className="h-full rounded-full"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Print Queue & Maintenance */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200">Очередь печати ({queuedJobs.length})</span>
          <button className="text-[11px] text-orange-400 hover:underline">+ Модель</button>
        </div>

        {queuedJobs.length > 0 ? (
          <div className="space-y-2">
            {queuedJobs.map((job) => (
              <div
                key={job.id}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-200">{job.title}</div>
                  <div className="text-[10px] text-slate-400">
                    {job.weightGrams}г • {job.estimatedDuration} • ~{job.costRub} ₽
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/5 text-slate-400">
                  В очереди
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-slate-500">Очередь печати пуста</p>
        )}

        {/* Maintenance Box */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            Смазка направляющих: через 35 моточасов
          </span>
          <span className="text-emerald-400 font-semibold">Все в норме ✓</span>
        </div>
      </div>
    </div>
  );
};

