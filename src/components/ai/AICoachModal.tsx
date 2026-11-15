"use client";

import React, { useState } from "react";
import { X, Sparkles, Send, Bot, User, Key } from "lucide-react";

interface AICoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  userContext?: any;
}

interface Message {
  role: "assistant" | "user";
  text: string;
}

export const AICoachModal: React.FC<AICoachModalProps> = ({ isOpen, onClose, userContext }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Привет, Илья! Я твой персональный AI-коуч в LifeOS. Могу расписать программу тренировок, посчитать план накоплений на Пассат Б6 или подсказать настройки для 3D-печати. О чем спросишь?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const promptText = (textToSend || input).trim();
    if (!promptText || loading) return;

    const newMsgs: Message[] = [...messages, { role: "user", text: promptText }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          userContext,
          apiKey: apiKey.trim() || undefined,
        }),
      });

      const data = await res.json();
      setMessages([...newMsgs, { role: "assistant", text: data.reply }]);
    } catch (e) {
      setMessages([
        ...newMsgs,
        { role: "assistant", text: "Что-то пошло не так, но я все равно верю в твои цели!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "🏋️ Составь программу в зале на 3 дня",
    "🚗 План накоплений на Пассат Б6",
    "🖨️ Как настроить идеальную печать PETG",
    "🇬🇧 Разговорные фразы на каждый день",
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md apple-card rounded-3xl p-5 shadow-2xl flex flex-col h-[520px] relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>AI Коуч LifeOS</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                  FREE
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">Умные советы по залу, финансам и печати</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="p-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white"
              title="Свой Gemini API ключ (бесплатно)"
            >
              <Key className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Optional Custom Gemini Key Input */}
        {showKeyInput && (
          <div className="p-2.5 rounded-2xl bg-[#1b1f2a] border border-white/[0.08] mt-2 space-y-1">
            <div className="text-[10px] text-slate-300">
              Бесплатный ключ Gemini API (опционально для прямого безлимитного ИИ):
            </div>
            <input
              type="password"
              placeholder="Вставь AI Studio ключ (или оставь пустым)..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-black/40 border border-white/[0.08] rounded-xl px-2.5 py-1 text-xs text-white"
            />
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 text-xs ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "assistant" && (
                <div className="w-6 h-6 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                  m.role === "user"
                    ? "bg-emerald-500 text-slate-950 font-medium rounded-tr-sm"
                    : "bg-[#1b1f2a] text-slate-200 rounded-tl-sm whitespace-pre-wrap"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-2 text-xs text-slate-400 items-center">
              <Bot className="w-4 h-4 animate-spin text-emerald-400" />
              <span>Генерирую ответ...</span>
            </div>
          )}
        </div>

        {/* Quick prompt pills */}
        <div className="flex gap-1.5 overflow-x-auto py-1.5 no-scrollbar">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-[10px] whitespace-nowrap flex-shrink-0 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex gap-2 pt-2 border-t border-white/[0.06]">
          <input
            type="text"
            placeholder="Спроси о залу, целям, печати..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-[#1b1f2a] border border-white/[0.08] rounded-2xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="w-9 h-9 rounded-2xl bg-white text-slate-950 flex items-center justify-center font-bold disabled:opacity-40 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
