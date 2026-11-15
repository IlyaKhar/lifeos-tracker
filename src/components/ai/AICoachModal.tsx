"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, Send, Bot, User, Key, ExternalLink } from "lucide-react";

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
      text: "Привет, Илья! Я твой персональный AI-коуч в LifeOS. Могу расписать программу тренировок, посчитать план накоплений на Пассат Б6, подсказать расчет цен для 3D-печати или фразы на английском. О чем спросишь?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("lifeos_gemini_key") || "";
      setApiKey(savedKey);
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    if (typeof window !== "undefined") {
      localStorage.setItem("lifeos_gemini_key", key);
    }
  };

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
    "🖨️ Сколько брать за печать 100г детали",
    "🇬🇧 5 крутых фраз на каждый день",
  ];

  const providerLabel = apiKey.startsWith("gsk_")
    ? "GROQ (LLAMA 3.3)"
    : apiKey.startsWith("AQ.") || apiKey.startsWith("AIza")
    ? "GEMINI LIVE"
    : apiKey.startsWith("sk-or-")
    ? "OPENROUTER"
    : apiKey.startsWith("sk-")
    ? "OPENAI"
    : "SMART AI";

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md apple-card rounded-3xl p-5 shadow-2xl flex flex-col h-[540px] relative">
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
                  {providerLabel}
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">Умные советы по залу, финансам и целям</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className={`p-1.5 rounded-full transition-all ${
                apiKey
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white"
              }`}
              title="Настройки API ключа"
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

        {/* Optional Custom API Key Input */}
        {showKeyInput && (
          <div className="p-3 rounded-2xl bg-[#1b1f2a] border border-white/[0.08] my-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-400">
                Подключение реального ИИ
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-emerald-400 hover:underline flex items-center gap-0.5 font-bold"
                >
                  <span>Groq (10 сек)</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <span className="text-slate-600">•</span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-sky-400 hover:underline flex items-center gap-0.5"
                >
                  <span>Gemini</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
            <p className="text-[9px] text-slate-400 leading-relaxed">
              💡 <strong>Groq</strong> (ключ <code className="text-emerald-300">gsk_...</code>) — работает бесплатно, регистрация через Google в 1 клик, без Cloud-проектов и ограничений! Или вставь Gemini (<code className="text-sky-300">AQ.</code> / <code className="text-sky-300">AIza</code>).
            </p>
            <input
              type="text"
              placeholder="Вставь ключ (gsk_... или AQ.... или AIzaSy...)"
              value={apiKey}
              onChange={(e) => handleSaveApiKey(e.target.value)}
              className="w-full bg-black/40 border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-white font-mono"
            />
          </div>
        )}

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed break-words whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-emerald-500 text-slate-950 font-medium rounded-tr-sm"
                    : "bg-[#1b1f2a] text-slate-200 border border-white/[0.05] rounded-tl-sm shadow-sm"
                }`}
              >
                {m.text}
              </div>
              {m.role === "user" && (
                <div className="w-7 h-7 rounded-full bg-white/[0.08] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-2.5 items-center text-xs text-slate-400">
              <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              </div>
              <span>Думаю...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        {messages.length <= 2 && (
          <div className="grid grid-cols-2 gap-1.5 pb-2">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="p-1.5 px-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-[10px] text-slate-300 text-left truncate active:scale-95 transition-all"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2">
          <input
            type="text"
            placeholder="Спроси о залу, Пассате, 3D-печати..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
            className="flex-1 bg-[#1b1f2a] border border-white/[0.08] rounded-2xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="w-8 h-8 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 flex-shrink-0 font-bold"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
