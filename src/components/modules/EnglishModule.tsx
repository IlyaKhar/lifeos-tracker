"use client";

import React, { useState, useEffect } from "react";
import { Languages, Plus, Trash2, CheckCircle2, BookOpen } from "lucide-react";
import { StorageService, WordItem } from "@/lib/storage";
import confetti from "canvas-confetti";

export const EnglishModule: React.FC = () => {
  const [words, setWords] = useState<WordItem[]>([]);
  const [minutesToday, setMinutesToday] = useState(0);
  const [targetMinutes, setTargetMinutes] = useState(30);

  // New Word Input
  const [showAddWord, setShowAddWord] = useState(false);
  const [newWord, setNewWord] = useState("");
  const [newTranslation, setNewTranslation] = useState("");

  useEffect(() => {
    setWords(StorageService.getEnglishWords());
    setMinutesToday(StorageService.getEnglishMinutes());
  }, []);

  const handleAddWord = () => {
    if (!newWord.trim()) return;
    const item: WordItem = {
      id: "w_" + Date.now(),
      word: newWord.trim(),
      translation: newTranslation.trim(),
      date: new Date().toISOString().split("T")[0],
    };
    const updated = [item, ...words];
    setWords(updated);
    StorageService.saveEnglishWords(updated);
    setNewWord("");
    setNewTranslation("");
    setShowAddWord(false);
    confetti({ particleCount: 25, spread: 45 });
  };

  const handleDeleteWord = (id: string) => {
    const updated = words.filter((w) => w.id !== id);
    setWords(updated);
    StorageService.saveEnglishWords(updated);
  };

  const handleAddMinutes = (min: number) => {
    const updated = minutesToday + min;
    setMinutesToday(updated);
    StorageService.saveEnglishMinutes(updated);
  };

  const progressPercent = Math.min(100, Math.round((minutesToday / Math.max(1, targetMinutes)) * 100));

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Daily Study Target */}
      <div className="apple-card p-4 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                Практика сегодня
              </span>
              <div className="text-xl font-mono font-bold text-white mt-0.5">
                {minutesToday} <span className="text-xs font-normal text-slate-400">/ {targetMinutes} мин</span>
              </div>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full">
            {progressPercent}%
          </span>
        </div>

        <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
          <div
            style={{ width: `${progressPercent}%` }}
            className="bg-sky-400 h-full rounded-full transition-all"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleAddMinutes(15)}
            className="flex-1 py-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-sky-300 text-xs font-bold active:scale-95 transition-all text-center"
          >
            +15 мин
          </button>
          <button
            onClick={() => handleAddMinutes(30)}
            className="flex-1 py-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-sky-300 text-xs font-bold active:scale-95 transition-all text-center"
          >
            +30 мин
          </button>
        </div>
      </div>

      {/* 2. Custom Words Dictionary */}
      <div className="apple-card p-4 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-white tracking-tight">Мой словарь слов</h4>
            <span className="text-[10px] text-slate-400">{words.length} выученных слов</span>
          </div>
          <button
            onClick={() => setShowAddWord(!showAddWord)}
            className="px-3 py-1 rounded-full bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-xs font-semibold flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>Слово</span>
          </button>
        </div>

        {/* Add Word Input */}
        {showAddWord && (
          <div className="p-3 rounded-2xl bg-[#1b1f2a] space-y-2">
            <input
              type="text"
              placeholder="Слово на английском (e.g. Relentless)"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              className="w-full bg-black/30 border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-white"
              autoFocus
            />
            <input
              type="text"
              placeholder="Перевод на русский (e.g. Неумолимый, упорный)"
              value={newTranslation}
              onChange={(e) => setNewTranslation(e.target.value)}
              className="w-full bg-black/30 border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-white"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddWord}
                className="flex-1 py-1.5 bg-sky-400 text-slate-950 font-bold rounded-xl text-xs"
              >
                Сохранить слово
              </button>
              <button
                onClick={() => setShowAddWord(false)}
                className="px-3 py-1.5 bg-white/[0.05] text-slate-400 rounded-xl text-xs"
              >
                Отмена
              </button>
            </div>
          </div>
        )}

        {/* Words List */}
        {words.length > 0 ? (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {words.map((w) => (
              <div
                key={w.id}
                className="p-2.5 rounded-2xl bg-[#1b1f2a] flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">{w.word}</div>
                  <div className="text-[10px] text-slate-400">{w.translation || "Без перевода"}</div>
                </div>
                <button
                  onClick={() => handleDeleteWord(w.id)}
                  className="p-1 rounded-full text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-slate-500 text-xs">
            Словарь пока пуст. Добавь свои первые слова!
          </div>
        )}
      </div>
    </div>
  );
};
