"use client";

import React, { useState, useEffect } from "react";
import { Book } from "@/types";
import { StorageService } from "@/lib/storage";
import { BookOpen, CheckCircle2, Plus, Trash2, Edit3 } from "lucide-react";
import confetti from "canvas-confetti";

export const BooksModule: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newTotalPages, setNewTotalPages] = useState("");

  const [activeBookForPage, setActiveBookForPage] = useState<string | null>(null);
  const [customPage, setCustomPage] = useState("");

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

  const handleSetExactPage = (bookId: string) => {
    const val = parseInt(customPage);
    if (isNaN(val) || val < 0) return;
    const updated = books.map((b) => {
      if (b.id === bookId) {
        const next = Math.min(b.totalPages, val);
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
    setCustomPage("");
    setActiveBookForPage(null);
  };

  const handleDeleteBook = (id: string) => {
    if (confirm("Удалить эту книгу из списка?")) {
      const updated = StorageService.deleteBook(id);
      setBooks(updated);
    }
  };

  const handleAddBook = () => {
    const pages = parseInt(newTotalPages);
    if (!newTitle.trim() || isNaN(pages) || pages <= 0) return;
    const book: Book = {
      id: "b_" + Date.now(),
      title: newTitle.trim(),
      author: newAuthor.trim() || "Неизвестный автор",
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
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
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
        <div className="apple-card p-4 rounded-3xl space-y-3 border border-purple-500/20">
          <span className="text-xs font-bold text-white">Добавить новую книгу</span>
          <input
            type="text"
            placeholder="Название (например: Чистый код)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-[#1b1f2a] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Автор (например: Роберт Мартин)"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              className="flex-1 bg-[#1b1f2a] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white"
            />
            <input
              type="number"
              placeholder="Страниц"
              value={newTotalPages}
              onChange={(e) => setNewTotalPages(e.target.value)}
              className="w-28 bg-[#1b1f2a] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setShowAdd(false)}
              className="flex-1 py-2 bg-white/[0.06] text-slate-300 font-semibold rounded-xl text-xs"
            >
              Отмена
            </button>
            <button
              onClick={handleAddBook}
              className="flex-1 py-2 bg-purple-500 text-white font-bold rounded-xl text-xs active:scale-95 transition-all shadow-md"
            >
              Добавить на полку
            </button>
          </div>
        </div>
      )}

      {books.length === 0 ? (
        <div className="apple-card p-6 rounded-3xl text-center space-y-2">
          <p className="text-xs text-slate-400">Полка пуста. Добавь книгу, которую сейчас читаешь!</p>
          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 rounded-xl bg-purple-500 text-white text-xs font-bold"
          >
            + Добавить книгу
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {books.map((book) => {
            const pct = Math.round((book.currentPage / book.totalPages) * 100);
            const isDone = book.status === "completed" || pct === 100;
            const isEditingPage = activeBookForPage === book.id;

            return (
              <div
                key={book.id}
                className={`apple-card p-4 rounded-3xl space-y-3 ${
                  isDone ? "border-emerald-500/20" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">{book.title}</h4>
                    <p className="text-[11px] text-slate-400">{book.author}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isDone ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Прочитано
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-bold text-purple-400">{pct}%</span>
                    )}
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="p-1.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Удалить книгу"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full rounded-full transition-all ${
                        isDone ? "bg-emerald-400" : "bg-purple-400"
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>
                      {book.currentPage} / {book.totalPages} стр.
                    </span>
                    <span>Осталось: {Math.max(0, book.totalPages - book.currentPage)} стр.</span>
                  </div>
                </div>

                {/* Quick Reading Buttons */}
                {!isDone && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdatePage(book.id, 10)}
                        className="flex-1 py-1.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-purple-300 text-xs font-mono font-semibold active:scale-95 transition-all text-center"
                      >
                        +10 стр.
                      </button>
                      <button
                        onClick={() => handleUpdatePage(book.id, 25)}
                        className="flex-1 py-1.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-purple-300 text-xs font-mono font-semibold active:scale-95 transition-all text-center"
                      >
                        +25 стр.
                      </button>
                      <button
                        onClick={() => setActiveBookForPage(isEditingPage ? null : book.id)}
                        className={`px-3 py-1.5 rounded-2xl text-xs font-semibold active:scale-95 transition-all text-center ${
                          isEditingPage
                            ? "bg-purple-500 text-white font-bold"
                            : "bg-white/[0.04] hover:bg-white/[0.08] text-slate-300"
                        }`}
                      >
                        Своя стр.
                      </button>
                    </div>

                    {isEditingPage && (
                      <div className="flex items-center gap-2 pt-1 border-t border-white/[0.04]">
                        <input
                          type="number"
                          placeholder={`Текущая стр. (до ${book.totalPages})`}
                          value={customPage}
                          onChange={(e) => setCustomPage(e.target.value)}
                          className="flex-1 bg-black/40 border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                        />
                        <button
                          onClick={() => handleSetExactPage(book.id)}
                          className="px-3 py-1.5 bg-purple-500 text-white font-bold rounded-xl text-xs active:scale-95"
                        >
                          Сохранить
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
