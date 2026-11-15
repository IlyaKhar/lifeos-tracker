"use client";

import React, { useState } from "react";
import { ModuleItem } from "@/types";
import { Plus, Check, Trash2 } from "lucide-react";
import { AppIcon } from "@/components/common/AppIcon";

interface CustomModuleProps {
  module: ModuleItem;
}

export const CustomModule: React.FC<CustomModuleProps> = ({ module }) => {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<{ id: string; text: string; done: boolean }[]>([
    { id: "1", text: "Первая цель в сфере", done: false },
  ]);
  const [newItem, setNewItem] = useState("");

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    setItems((prev) => [...prev, { id: Date.now().toString(), text: newItem.trim(), done: false }]);
    setNewItem("");
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Module Overview Card */}
      <div className="apple-card p-5 rounded-3xl space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.06] text-white flex items-center justify-center">
            <AppIcon name={module.icon || module.category} className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">{module.title}</h3>
            <p className="text-xs text-slate-400">{module.subtitle || "Личный трекер"}</p>
          </div>
        </div>
      </div>

      {/* Counter Widget */}
      <div className="apple-card p-5 rounded-3xl flex items-center justify-between">
        <div>
          <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Счетчик активности</span>
          <div className="text-2xl font-mono font-bold text-white mt-0.5">{count} раз</div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCount((c) => Math.max(0, c - 1))}
            className="w-10 h-10 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-white font-bold flex items-center justify-center text-lg active:scale-95 transition-all"
          >
            -
          </button>
          <button
            onClick={() => setCount((c) => c + 1)}
            className="w-10 h-10 rounded-2xl bg-white text-slate-950 font-bold flex items-center justify-center text-lg active:scale-95 transition-all shadow-md"
          >
            +
          </button>
        </div>
      </div>

      {/* Custom Items Checklist */}
      <div className="apple-card p-5 rounded-3xl space-y-3">
        <span className="text-xs font-bold text-white tracking-tight">Чек-лист задач и целей</span>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Добавить пункт..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
            className="flex-1 bg-[#1b1f2a] border border-white/[0.08] rounded-2xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={handleAddItem}
            className="px-4 py-2 bg-white text-slate-950 font-bold rounded-2xl text-xs active:scale-95 transition-all"
          >
            +
          </button>
        </div>

        <div className="space-y-2 pt-1">
          {items.map((it) => (
            <div
              key={it.id}
              onClick={() =>
                setItems((prev) =>
                  prev.map((x) => (x.id === it.id ? { ...x, done: !x.done } : x))
                )
              }
              className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] flex items-center gap-2.5 cursor-pointer transition-all text-xs"
            >
              <div
                className={`w-4 h-4 rounded-lg flex items-center justify-center border transition-all ${
                  it.done ? "bg-emerald-400 border-emerald-400 text-slate-950 font-bold" : "border-slate-600"
                }`}
              >
                {it.done && <Check className="w-3 h-3" />}
              </div>
              <span className={`flex-1 text-slate-200 ${it.done ? "line-through opacity-50" : "font-medium"}`}>
                {it.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
