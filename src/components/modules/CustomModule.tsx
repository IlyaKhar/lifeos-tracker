"use client";

import React, { useState } from "react";
import { ModuleItem } from "@/types";
import { Plus, Check, Trash2, Edit2 } from "lucide-react";

interface CustomModuleProps {
  module: ModuleItem;
}

export const CustomModule: React.FC<CustomModuleProps> = ({ module }) => {
  const [count, setCount] = useState(0);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<{ id: string; text: string; done: boolean }[]>([
    { id: "1", text: "Первая цель в модуле", done: false },
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
      <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-2">
        <div className="flex items-center gap-2.5">
          <span className="text-3xl p-2 rounded-2xl bg-white/5 border border-white/10">
            {module.icon}
          </span>
          <div>
            <h3 className="text-base font-bold text-white">{module.title}</h3>
            <p className="text-xs text-slate-400">{module.subtitle || "Кастомный трекер"}</p>
          </div>
        </div>
      </div>

      {/* Counter Widget */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Счетчик активности</span>
          <div className="text-2xl font-mono font-bold text-white mt-0.5">{count} раз</div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCount((c) => Math.max(0, c - 1))}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold flex items-center justify-center text-base"
          >
            -
          </button>
          <button
            onClick={() => setCount((c) => c + 1)}
            className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-base active:scale-95 transition-all"
          >
            +
          </button>
        </div>
      </div>

      {/* Custom Items Checklist */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3">
        <span className="text-xs font-bold text-slate-200">Чек-лист задач & целей</span>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Добавить пункт..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
          />
          <button
            onClick={handleAddItem}
            className="px-3.5 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs"
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
              className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center gap-2 cursor-pointer hover:border-white/20 transition-all text-xs"
            >
              <div
                className={`w-4 h-4 rounded flex items-center justify-center border ${
                  it.done ? "bg-emerald-500 border-emerald-500 text-slate-950" : "border-slate-600"
                }`}
              >
                {it.done && <Check className="w-3 h-3" />}
              </div>
              <span className={`flex-1 text-slate-200 ${it.done ? "line-through opacity-50" : ""}`}>
                {it.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
