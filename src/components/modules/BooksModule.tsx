"use client";

import React, { useState, useEffect } from "react";
import { Book } from "@/types";
import { StorageService } from "@/lib/storage";
import { BookOpen, CheckCircle, Clock, Plus } from "lucide-react";
import confetti from "canvas-confetti";

export const BooksModule: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newTotalPages, setNewTotalPages] = useState("");

  useEffect(() => {
    setBooks(StorageService.getBooks());
  }, []);

  const handleUpdatePage = (bookId: string, delta: number) => {
    const updated = books.map((b) => {
      if (b.id === bookId) {
        const next = Math.max(0, Math.min(b.totalPages, b.currentPage + delta));
        const completed = next >= b.totalPages;
        if (completed && b.status !== "completed") {
          confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
        }
        return {
          ...b,
          currentPage: next,
          status: (completed ? "completed" : "reading") as Book["status"],
        };
      }
      return b;
    });
    setBooks(updated);
    StorageService.saveBooks(updated);
  };

  const handleAddBook = () => {
    const pages = parseInt(newTotalPages);
    if (!newTitle || isNaN(pages) || pages <= 0) return;
    const book: Book = {
      id: "b_" + Date.now(),
      title: newTitle,
      author: newAuthor || "Неизвестный автор",
      totalPages: pages,
      currentPage: 0,
      status: "reading",
    };
    const updated = [book, ...books];
    setBooks(updated);
    StorageService.saveBooks(updated);
    setShowAdd(false);
    setNewTitle("");
    setNewAuthor("");
    setNewTotalPages("");
  };

  return (
    <div className="space-y-4 pb-12">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
          <BookOpen className="w-4 h-4 text-purple-400" />
          <span>Книжная полка</span>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="text-[11px] text-purple-400 hover:underline flex items-center gap-1 font-semibold"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Добавить книгу</span>
        </button>
      </div>

      {showAdd && (
        <div className="glass-card p-3.5 rounded-2xl border border-purple-500/40 space-y-2">
          <span className="text-xs font-bold text-slate-200">Новая книга</span>
          <input
            type="text"
            placeholder="Название (например: Грокаем алгоритмы)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Автор"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
            />
            <input
              type="number"
              placeholder="Всего страниц"
              value={newTotalPages}
              onChange={(e) => setNewTotalPages(e.target.value)}
              className="w-28 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
            />
          </div>
          <button
            onClick={handleAddBook}
            className="w-full py-1.5 bg-purple-500 text-white font-bold rounded-lg text-xs"
          >
            Добавить на полку
          </button>
        </div>
      )}

      <div className="space-y-3">
        {books.map((book) => {
          const pct = Math.round((book.currentPage / book.totalPages) * 100);
          const isDone = book.status === "completed" || pct === 100;

          return (
            <div
              key={book.id}
              className={`glass-card p-4 rounded-2xl border transition-all ${
                isDone ? "border-emerald-500/30 bg-emerald-950/10" : "border-purple-500/20"
              } space-y-3`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-100">{book.title}</h4>
                  <p className="text-[11px] text-slate-400">{book.author}</p>
                </div>
                {isDone ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle className="w-3 h-3" /> Прочитано
                  </span>
                ) : (
                  <span className="text-xs font-mono font-bold text-purple-400">{pct}%</span>
                )}
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-white/5">
                  <div
                    style={{ width: `${pct}%` }}
                    className={`h-full rounded-full transition-all ${
                      isDone ? "bg-emerald-400" : "bg-purple-500"
                    }`}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>
                    {book.currentPage} / {book.totalPages} стр.
                  </span>
                  <span>Осталось: {book.totalPages - book.currentPage} стр.</span>
                </div>
              </div>

              {/* Quick Reading Buttons */}
              {!isDone && (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleUpdatePage(book.id, 10)}
                    className="flex-1 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold active:scale-95 transition-all"
                  >
                    +10 стр.
                  </button>
                  <button
                    onClick={() => handleUpdatePage(book.id, 25)}
                    className="flex-1 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold active:scale-95 transition-all"
                  >
                    +25 стр.
                  </button>
                  <button
                    onClick={() => handleUpdatePage(book.id, 50)}
                    className="flex-1 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold active:scale-95 transition-all"
                  >
                    +50 стр.
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

