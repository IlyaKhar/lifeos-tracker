"use client";

import React, { useState, useEffect } from "react";
import { FilamentSpool, PrintJob } from "@/types";
import { StorageService } from "@/lib/storage";
import {
  Layers,
  Thermometer,
  Clock,
  Plus,
  Coins,
  Wrench,
  CheckCircle2,
  Trash2,
  Play,
  RotateCcw,
} from "lucide-react";
import confetti from "canvas-confetti";

export const Print3DModule: React.FC = () => {
  const [spools, setSpools] = useState<FilamentSpool[]>([]);
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([]);
  
  // Spool form state
  const [showAddSpool, setShowAddSpool] = useState(false);
  const [newBrand, setNewBrand] = useState("");
  const [newMaterial, setNewMaterial] = useState<FilamentSpool["material"]>("PLA");
  const [newColor, setNewColor] = useState("");
  const [newColorHex, setNewColorHex] = useState("#38bdf8");
  const [newWeight, setNewWeight] = useState("1000");

  // Print Job form state
  const [showAddJob, setShowAddJob] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobGrams, setJobGrams] = useState("");
  const [jobDuration, setJobDuration] = useState("");

  useEffect(() => {
    setSpools(StorageService.getSpools());
    setPrintJobs(StorageService.getPrintJobs());
  }, []);

  const handleAddSpool = () => {
    if (!newBrand.trim() || !newColor.trim()) return;
    const totalG = parseInt(newWeight) || 1000;
    const spool: FilamentSpool = {
      id: "sp_" + Date.now(),
      brand: newBrand.trim(),
      material: newMaterial,
      colorName: newColor.trim(),
      colorHex: newColorHex,
      totalWeightGrams: totalG,
      remainingWeightGrams: totalG,
      nozzleTemp: newMaterial === "PETG" ? 235 : newMaterial === "ABS" ? 245 : 210,
      bedTemp: newMaterial === "PETG" ? 80 : newMaterial === "ABS" ? 100 : 60,
      priceRub: 1200,
    };
    const updated = [...spools, spool];
    setSpools(updated);
    StorageService.saveSpools(updated);
    setShowAddSpool(false);
    setNewBrand("");
    setNewColor("");
  };

  const handleDeleteSpool = (id: string) => {
    if (confirm("Удалить эту катушку со склада?")) {
      const updated = StorageService.deleteSpool(id);
      setSpools(updated);
    }
  };

  const handleAddJob = () => {
    if (!jobTitle.trim()) return;
    const grams = parseInt(jobGrams) || 50;
    const cost = Math.round(grams * 1.3);
    const job: PrintJob = {
      id: "pj_" + Date.now(),
      title: jobTitle.trim(),
      spoolId: spools[0]?.id || "sp1",
      weightGrams: grams,
      estimatedDuration: jobDuration.trim() || "2ч 00м",
      costRub: cost,
      status: printJobs.some((j) => j.status === "printing") ? "queued" : "printing",
      progressPercent: printJobs.some((j) => j.status === "printing") ? 0 : 10,
      dateAdded: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
    };
    const updated = [...printJobs, job];
    setPrintJobs(updated);
    StorageService.savePrintJobs(updated);
    setShowAddJob(false);
    setJobTitle("");
    setJobGrams("");
    setJobDuration("");
  };

  const handleCompleteActiveJob = (jobId: string) => {
    confetti({ particleCount: 40, spread: 60 });
    const updated = printJobs.filter((j) => j.id !== jobId);
    // Promote first queued to printing
    const nextQueued = updated.find((j) => j.status === "queued");
    if (nextQueued) {
      nextQueued.status = "printing";
      nextQueued.progressPercent = 10;
    }
    setPrintJobs(updated);
    StorageService.savePrintJobs(updated);
  };

  const handleDeleteJob = (id: string) => {
    const updated = StorageService.deletePrintJob(id);
    setPrintJobs(updated);
  };

  const activeJob = printJobs.find((j) => j.status === "printing");
  const queuedJobs = printJobs.filter((j) => j.status === "queued");

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Active Print Job */}
      {activeJob ? (
        <div className="apple-card p-4 rounded-3xl space-y-3 border border-orange-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center flex-shrink-0">
                <Layers className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">
                  Идет печать...
                </span>
                <h3 className="font-bold text-sm text-white tracking-tight">{activeJob.title}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                {activeJob.progressPercent}%
              </span>
              <button
                onClick={() => handleCompleteActiveJob(activeJob.id)}
                className="px-2.5 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold active:scale-95 flex items-center gap-1"
                title="Завершить печать"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Готово</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
              <div
                style={{ width: `${activeJob.progressPercent}%` }}
                className="bg-orange-400 h-full rounded-full transition-all"
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                Время: {activeJob.estimatedDuration}
              </span>
              <span className="flex items-center gap-1">
                <Coins className="w-3 h-3 text-amber-400" />
                {activeJob.costRub} ₽ ({activeJob.weightGrams} г)
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="apple-card p-4 rounded-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.04] text-slate-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Принтер в ожидании</div>
              <div className="text-[11px] text-slate-400">Стол и сопло холодные</div>
            </div>
          </div>
          <button
            onClick={() => setShowAddJob(true)}
            className="px-3.5 py-1.5 rounded-full bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-xs font-bold flex items-center gap-1 active:scale-95"
          >
            <Play className="w-3 h-3" />
            <span>Печать</span>
          </button>
        </div>
      )}

      {/* 2. Filament Inventory Card */}
      <div className="apple-card p-4 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center flex-shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white tracking-tight">Склад катушек (Филамент)</h4>
              <p className="text-[10px] text-slate-400">{spools.length} катушек в наличии</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddSpool(!showAddSpool)}
            className="px-3 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.08] text-slate-200 text-xs font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5 text-orange-400" />
            <span>Катушка</span>
          </button>
        </div>

        {/* Add Spool Form */}
        {showAddSpool && (
          <div className="p-3.5 rounded-2xl bg-[#1b1f2a] border border-white/[0.08] space-y-2.5">
            <div className="text-xs font-semibold text-white">Добавить катушку филамента</div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Бренд (Kingroon, eSUN)"
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                className="bg-black/30 border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-white"
              />
              <select
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value as any)}
                className="bg-black/30 border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-white"
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
                placeholder="Цвет (Black, Matte White)"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="bg-black/30 border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-white"
              />
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="w-8 h-8 rounded-xl border-none bg-transparent cursor-pointer"
                />
                <button
                  onClick={handleAddSpool}
                  className="flex-1 py-1.5 bg-orange-400 text-slate-950 font-bold rounded-xl text-xs active:scale-95 shadow-sm"
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
                className="p-3 rounded-2xl bg-[#1b1f2a] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    style={{ backgroundColor: sp.colorHex }}
                    className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm flex-shrink-0"
                  />
                  <div>
                    <div className="text-xs font-semibold text-white">
                      {sp.brand} <span className="text-orange-400 font-bold">{sp.material}</span> ({sp.colorName})
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                      <span className="flex items-center gap-0.5">
                        <Thermometer className="w-2.5 h-2.5 text-slate-500" />
                        {sp.nozzleTemp}°C / {sp.bedTemp}°C
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-white">
                      {sp.remainingWeightGrams} <span className="text-slate-400 text-[10px]">/ {sp.totalWeightGrams} г</span>
                    </div>
                    <div className="w-16 bg-white/[0.06] h-1.5 rounded-full mt-1 overflow-hidden">
                      <div
                        style={{ width: `${pct}%`, backgroundColor: sp.colorHex }}
                        className="h-full rounded-full"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteSpool(sp.id)}
                    className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Print Queue Card */}
      <div className="apple-card p-4 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white">Очередь печати ({queuedJobs.length})</span>
          <button
            onClick={() => setShowAddJob(!showAddJob)}
            className="text-[11px] text-orange-400 font-semibold hover:underline flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>Новая модель</span>
          </button>
        </div>

        {/* Add Job Form */}
        {showAddJob && (
          <div className="p-3.5 rounded-2xl bg-[#1b1f2a] border border-white/[0.08] space-y-2.5">
            <div className="text-xs font-semibold text-white">Добавить модель в очередь</div>
            <input
              type="text"
              placeholder="Название модели (например: Подставка для телефона)"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full bg-black/30 border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-white"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Вес в граммах (например: 65)"
                value={jobGrams}
                onChange={(e) => setJobGrams(e.target.value)}
                className="bg-black/30 border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-white font-mono"
              />
              <input
                type="text"
                placeholder="Длительность (например: 3ч 15м)"
                value={jobDuration}
                onChange={(e) => setJobDuration(e.target.value)}
                className="bg-black/30 border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-white"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowAddJob(false)}
                className="flex-1 py-1.5 bg-white/[0.06] text-slate-300 font-semibold rounded-xl text-xs"
              >
                Отмена
              </button>
              <button
                onClick={handleAddJob}
                className="flex-1 py-1.5 bg-orange-400 text-slate-950 font-bold rounded-xl text-xs active:scale-95"
              >
                В очередь
              </button>
            </div>
          </div>
        )}

        {queuedJobs.length > 0 ? (
          <div className="space-y-2">
            {queuedJobs.map((job) => (
              <div
                key={job.id}
                className="p-2.5 rounded-2xl bg-[#1b1f2a] flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-white">{job.title}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {job.weightGrams}г • {job.estimatedDuration} • ~{job.costRub} ₽
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/[0.05] text-slate-400">
                    В очереди
                  </span>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="p-1 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-slate-500">Очередь печати пуста</p>
        )}

        {/* Maintenance Box */}
        <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            Смазка направляющих: через 35 моточасов
          </span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> В норме
          </span>
        </div>
      </div>
    </div>
  );
};
