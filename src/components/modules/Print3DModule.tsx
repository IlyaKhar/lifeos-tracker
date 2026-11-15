"use client";

import React, { useState, useEffect } from "react";
import { FilamentSpool, PrintModelItem, PrintModelType, PrintModelStatus } from "@/types";
import { StorageService } from "@/lib/storage";
import {
  Layers,
  Thermometer,
  Plus,
  Coins,
  CheckCircle2,
  Trash2,
  User,
  ShoppingBag,
  Filter,
  Clock,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";

export const Print3DModule: React.FC = () => {
  const [spools, setSpools] = useState<FilamentSpool[]>([]);
  const [models, setModels] = useState<PrintModelItem[]>([]);

  // Spool form
  const [showAddSpool, setShowAddSpool] = useState(false);
  const [newBrand, setNewBrand] = useState("");
  const [newMaterial, setNewMaterial] = useState<FilamentSpool["material"]>("PLA");
  const [newColor, setNewColor] = useState("");
  const [newColorHex, setNewColorHex] = useState("#38bdf8");
  const [newWeight, setNewWeight] = useState("1000");

  // Model form
  const [showAddModel, setShowAddModel] = useState(false);
  const [modelTitle, setModelTitle] = useState("");
  const [modelType, setModelType] = useState<PrintModelType>("custom_order");
  const [modelPrice, setModelPrice] = useState("");
  const [modelWeight, setModelWeight] = useState("");
  const [selectedSpoolId, setSelectedSpoolId] = useState<string>("");
  const [modelStatus, setModelStatus] = useState<PrintModelStatus>("completed");

  // Filter
  const [filterType, setFilterType] = useState<"all" | "custom_order" | "for_myself">("all");

  useEffect(() => {
    const loadedSpools = StorageService.getSpools();
    setSpools(loadedSpools);
    if (loadedSpools.length > 0 && !selectedSpoolId) {
      setSelectedSpoolId(loadedSpools[0].id);
    }
    setModels(StorageService.getPrintModels());
  }, []);

  // 1. Spool Actions
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
    if (!selectedSpoolId) setSelectedSpoolId(spool.id);
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

  // 2. Model Actions
  const handleSaveModel = () => {
    if (!modelTitle.trim()) return;
    const price = modelType === "custom_order" ? parseFloat(modelPrice) || 0 : 0;
    const weight = parseInt(modelWeight) || 50;

    const item: PrintModelItem = {
      id: "pm_" + Date.now(),
      title: modelTitle.trim(),
      modelType,
      priceRub: price,
      weightGrams: weight,
      spoolId: selectedSpoolId || undefined,
      status: modelStatus,
      date: new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" }).format(new Date()),
    };

    const updated = StorageService.addPrintModel(item);
    setModels(updated);
    setSpools(StorageService.getSpools()); // Refresh spools if grams deducted

    if (price > 0) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    }

    setShowAddModel(false);
    setModelTitle("");
    setModelPrice("");
    setModelWeight("");
  };

  const handleUpdateStatus = (model: PrintModelItem, nextStatus: PrintModelStatus) => {
    const updated = StorageService.updatePrintModel({ ...model, status: nextStatus });
    setModels(updated);
  };

  const handleDeleteModel = (id: string) => {
    if (confirm("Удалить эту модель из журнала?")) {
      const updated = StorageService.deletePrintModel(id);
      setModels(updated);
    }
  };

  // Statistics
  const totalEarned = models
    .filter((m) => m.modelType === "custom_order")
    .reduce((sum, m) => sum + (m.priceRub || 0), 0);

  const customOrderCount = models.filter((m) => m.modelType === "custom_order").length;
  const forMyselfCount = models.filter((m) => m.modelType === "for_myself").length;
  const totalPlasticGrams = models.reduce((sum, m) => sum + (m.weightGrams || 0), 0);

  const filteredModels = models.filter((m) => {
    if (filterType === "all") return true;
    return m.modelType === filterType;
  });

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Earnings & Stats Summary Card */}
      <div className="apple-card p-4 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center flex-shrink-0">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">
                Доход с печати на заказ
              </span>
              <div className="text-xl font-mono font-bold text-white">
                {totalEarned.toLocaleString("ru-RU")} ₽
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowAddModel(true)}
            className="px-3 py-1.5 rounded-full bg-orange-500 text-slate-950 text-xs font-bold flex items-center gap-1 active:scale-95 transition-all shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Записать модель</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.04] text-center">
          <div className="p-2 rounded-2xl bg-white/[0.02]">
            <span className="text-[10px] text-slate-400 block">На заказ</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">{customOrderCount} шт.</span>
          </div>
          <div className="p-2 rounded-2xl bg-white/[0.02]">
            <span className="text-[10px] text-slate-400 block">Для себя</span>
            <span className="text-xs font-bold text-sky-400 font-mono">{forMyselfCount} шт.</span>
          </div>
          <div className="p-2 rounded-2xl bg-white/[0.02]">
            <span className="text-[10px] text-slate-400 block">Расход пластика</span>
            <span className="text-xs font-bold text-amber-400 font-mono">{totalPlasticGrams} г</span>
          </div>
        </div>
      </div>

      {/* 2. Add Model Form Modal/Inline */}
      {showAddModel && (
        <div className="apple-card p-4 rounded-3xl space-y-3 border border-orange-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">Записать напечатанную модель</span>
            <button
              onClick={() => setShowAddModel(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Отмена
            </button>
          </div>

          <input
            type="text"
            placeholder="Название детали / модельки (например: Корпус БП, Крепление GoPro)"
            value={modelTitle}
            onChange={(e) => setModelTitle(e.target.value)}
            className="w-full bg-[#1b1f2a] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white"
          />

          {/* Type Selector: Для себя vs На заказ */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setModelType("custom_order")}
              className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                modelType === "custom_order"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-white/[0.04] text-slate-400 hover:text-white"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>На заказ (клиент)</span>
            </button>
            <button
              type="button"
              onClick={() => setModelType("for_myself")}
              className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                modelType === "for_myself"
                  ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                  : "bg-white/[0.04] text-slate-400 hover:text-white"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Для себя</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {modelType === "custom_order" ? (
              <input
                type="number"
                placeholder="Сколько получу в ₽"
                value={modelPrice}
                onChange={(e) => setModelPrice(e.target.value)}
                className="bg-[#1b1f2a] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            ) : (
              <div className="bg-[#1b1f2a]/50 border border-white/[0.05] rounded-xl px-3 py-2 text-xs text-slate-400 flex items-center">
                0 ₽ (Личное)
              </div>
            )}
            <input
              type="number"
              placeholder="Вес пластика (г)"
              value={modelWeight}
              onChange={(e) => setModelWeight(e.target.value)}
              className="bg-[#1b1f2a] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono"
            />
          </div>

          {/* Spool selector */}
          {spools.length > 0 && (
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">С какой катушки списать вес:</span>
              <select
                value={selectedSpoolId}
                onChange={(e) => setSelectedSpoolId(e.target.value)}
                className="w-full bg-[#1b1f2a] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white"
              >
                {spools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.brand} {s.material} ({s.colorName}) — ост. {s.remainingWeightGrams} г
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleSaveModel}
            className="w-full py-2 bg-orange-400 text-slate-950 font-bold rounded-xl text-xs active:scale-95 transition-all shadow-md"
          >
            Сохранить в журнал
          </button>
        </div>
      )}

      {/* 3. Models Journal */}
      <div className="apple-card p-4 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white tracking-tight">Журнал напечатанных моделей</span>
          <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-xl">
            <button
              onClick={() => setFilterType("all")}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all ${
                filterType === "all" ? "bg-white/10 text-white" : "text-slate-400"
              }`}
            >
              Все
            </button>
            <button
              onClick={() => setFilterType("custom_order")}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all ${
                filterType === "custom_order" ? "bg-emerald-500/20 text-emerald-300" : "text-slate-400"
              }`}
            >
              Заказы
            </button>
            <button
              onClick={() => setFilterType("for_myself")}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all ${
                filterType === "for_myself" ? "bg-sky-500/20 text-sky-300" : "text-slate-400"
              }`}
            >
              Для себя
            </button>
          </div>
        </div>

        {filteredModels.length === 0 ? (
          <div className="text-center py-6 space-y-1">
            <p className="text-xs text-slate-400">Журнал моделей пока пуст</p>
            <p className="text-[10px] text-slate-500">Запиши свою первую готовую модель или заказ выше</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredModels.map((item) => {
              const isOrder = item.modelType === "custom_order";
              const spool = spools.find((s) => s.id === item.spoolId);

              return (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-[#1b1f2a] flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isOrder ? "bg-emerald-500/10 text-emerald-400" : "bg-sky-500/10 text-sky-400"
                      }`}
                    >
                      {isOrder ? <ShoppingBag className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">{item.title}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2 font-mono">
                        <span>{item.weightGrams} г</span>
                        {spool && (
                          <span className="flex items-center gap-1">
                            <span
                              style={{ backgroundColor: spool.colorHex }}
                              className="w-2 h-2 rounded-full inline-block"
                            />
                            {spool.brand} {spool.material}
                          </span>
                        )}
                        <span>• {item.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      {isOrder ? (
                        <div className="text-xs font-mono font-bold text-emerald-400">
                          +{item.priceRub.toLocaleString("ru-RU")} ₽
                        </div>
                      ) : (
                        <div className="text-[10px] font-semibold text-slate-400">Для себя</div>
                      )}
                      <span
                        onClick={() => {
                          const next: PrintModelStatus =
                            item.status === "in_progress"
                              ? "completed"
                              : item.status === "completed"
                              ? "paid"
                              : "completed";
                          handleUpdateStatus(item, next);
                        }}
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                          item.status === "paid"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : item.status === "completed"
                            ? "bg-white/[0.06] text-slate-300"
                            : "bg-amber-500/20 text-amber-300"
                        }`}
                        title="Нажми, чтобы сменить статус"
                      >
                        {item.status === "paid"
                          ? "Оплачено"
                          : item.status === "completed"
                          ? "Готово"
                          : "В процессе"}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteModel(item.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Filament Inventory Card (Катушки) */}
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
            className="px-3 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.08] text-slate-200 text-xs font-semibold flex items-center gap-1 active:scale-95"
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
    </div>
  );
};
