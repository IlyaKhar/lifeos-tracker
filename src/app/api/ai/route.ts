import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Smart built-in offline knowledge engine (failsafe)
function getSmartFallbackResponse(prompt: string, context?: any): string {
  const p = prompt.toLowerCase();

  if (p.includes("пасат") || p.includes("пассат") || p.includes("копилк") || p.includes("накоп") || p.includes("авто")) {
    return `🚗 **План накоплений на Volkswagen Passat B6 (700 000 ₽):**
1. **Ежемесячный темп:** При откладывании 30 000 ₽/мес цель закроется за ~23 месяца. Если форсировать до 50 000 ₽ — за 14 месяцев!
2. **Тактика чекпоинтов:**
   * Этап 1 (175 000 ₽ / 25%): Психологический рубеж — отпраздновать и не сбавлять темп.
   * Этап 2 (350 000 ₽ / 50%): Экватор — можно начинать мониторить рынок и живые комплектации (2.0 TDI / 1.8 TSI на надежной механике).
   * Этап 3 (700 000 ₽): Покупка + резерв 50 000 ₽ на ТО и жидкости.
3. **Совет:** Настрой автопополнение в день зарплаты сразу в копилку!`;
  }

  if (p.includes("программ") || p.includes("зал") || p.includes("трен") || p.includes("мышц") || p.includes("жим") || p.includes("спин") || p.includes("ног")) {
    return `🏋️ **Оптимальный сплит на 3 дня (Рост силовых и форма):**
* **День 1: Грудь + Плечи + Трицепс**
  1. Жим штанги лежа: 3-4 подхода × 6-8 повт. (прогрессия веса)
  2. Армейский жим стоя: 3 × 8-10
  3. Брусья или отжимания с весом: 3 × 10
* **День 2: Спина + Бицепс + Задняя дельта**
  1. Подтягивания с весом: 4 × 6-8
  2. Тяга штанги в наклоне: 3 × 8-10
  3. Подъем штанги на бицепс: 3 × 10-12
* **День 3: Ноги + Пресс**
  1. Приседания со штангой: 4 × 8
  2. Румынская тяга: 3 × 10
  3. Скручивания / планка: 3 сета

💡 *Правило прогрессии:* Отдых между тяжелыми подходами 90-120 сек, добавляй по 1-2.5 кг как только закрываешь все повторения.`;
  }

  if (p.includes("3d") || p.includes("печать") || p.includes("сопл") || p.includes("petg") || p.includes("pla") || p.includes("стол") || p.includes("скольк") || p.includes("цен") || p.includes("клиент")) {
    return `🖨️ **Ценообразование и настройки 3D-печати:**
* **Как считать стоимость клиенту:**
  * Формула: \`(Вес детали в граммах × 1.5 - 2 ₽) + (Время печати в часах × 70-100 ₽) + Амортизация/Моделирование\`.
  * Например, деталь 100 г на 4 часа: пластик ~150 ₽ + время работы ~300 ₽ = **от 600 до 900 ₽**.
* **Температуры:**
  * **PLA:** Сопло 205-215°C, Стол 55-60°C. Обдув 100%.
  * **PETG:** Сопло 230-240°C, Стол 75-85°C. Обдув 30-50%. Первый слой на 20 мм/с.`;
  }

  if (p.includes("англ") || p.includes("english") || p.includes("слов")) {
    return `🇬🇧 **5 полезных разговорных выражений для IT и жизни:**
1. *"Let's cut to the chase"* — Давайте сразу к делу (без лишних слов).
2. *"It's up to you"* — Решай сам / на твоё усмотрение.
3. *"I'll keep you posted"* — Буду держать тебя в курсе.
4. *"Hit the gym"* — Пойти потренить в зал.
5. *"Under the hood"* — То, как устроено внутри (под капотом).

💡 *Лайфхак:* Учи слова не по отдельности, а сразу в готовых фразах и контексте!`;
  }

  return `🤖 Привет, Илья! Я твой AI-коуч в LifeOS. Могу составить программу тренировок, расписать бюджет на Пассат, подсказать расчет цен в 3D-печати или английские фразы. Спрашивай о чем угодно!`;
}

export async function POST(req: Request) {
  try {
    const { prompt, userContext, apiKey } = await req.json();
    const rawKey = (apiKey || process.env.GEMINI_API_KEY || "").trim().replace(/^["']|["']$/g, "");

    const systemInstruction = `Ты — Алина, умный, поддерживающий и практичный AI-коуч в приложении LifeOS. Пользователя зовут Илья. Отвечай емко, по делу, дружелюбно, уверенно и практично на русском языке. Всегда давай полезные цифры, конкретные шаги и поддерживай мотивацию.`;

    // 1. If key is provided and looks like Gemini (starts with AQ. or AIza)
    if (rawKey && (rawKey.startsWith("AQ.") || rawKey.startsWith("AIza"))) {
      let lastError = "";

      // Try official SDK with gemini-2.0-flash, then gemini-1.5-flash
      for (const model of ["gemini-2.0-flash", "gemini-1.5-flash"]) {
        try {
          const ai = new GoogleGenAI({ apiKey: rawKey });
          const response = await ai.models.generateContent({
            model,
            contents: `${systemInstruction}\n\nВопрос Ильи: ${prompt}`,
          });

          if (response?.text) {
            return NextResponse.json({ reply: response.text });
          }
        } catch (geminiErr: any) {
          lastError = geminiErr?.message || String(geminiErr);
          console.error(`Gemini SDK error (${model}):`, geminiErr);
        }
      }

      // Try direct REST fetch with multiple header styles (x-goog-api-key, ?key=, Bearer)
      for (const model of ["gemini-2.0-flash", "gemini-1.5-flash"]) {
        // Method A: x-goog-api-key header
        try {
          const directRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": rawKey,
              },
              body: JSON.stringify({
                contents: [
                  {
                    role: "user",
                    parts: [{ text: `${systemInstruction}\n\nВопрос Ильи: ${prompt}` }],
                  },
                ],
              }),
            }
          );

          if (directRes.ok) {
            const data = await directRes.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              return NextResponse.json({ reply: text });
            }
          } else {
            const errJson = await directRes.json().catch(() => ({}));
            lastError = errJson?.error?.message || `HTTP ${directRes.status}`;
          }
        } catch (e: any) {
          lastError = e?.message || String(e);
        }

        // Method B: query parameter ?key=
        try {
          const queryRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(rawKey)}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [
                  {
                    role: "user",
                    parts: [{ text: `${systemInstruction}\n\nВопрос Ильи: ${prompt}` }],
                  },
                ],
              }),
            }
          );

          if (queryRes.ok) {
            const data = await queryRes.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              return NextResponse.json({ reply: text });
            }
          }
        } catch (e: any) {
          // ignore
        }

        // Method C: Bearer authorization
        try {
          const bearerRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${rawKey}`,
              },
              body: JSON.stringify({
                contents: [
                  {
                    role: "user",
                    parts: [{ text: `${systemInstruction}\n\nВопрос Ильи: ${prompt}` }],
                  },
                ],
              }),
            }
          );

          if (bearerRes.ok) {
            const data = await bearerRes.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              return NextResponse.json({ reply: text });
            }
          }
        } catch (e: any) {
          // ignore
        }
      }

      // DO NOT silently swallow! User inserted their key and expects honest feedback
      let diagnosticReply = `⚠️ Google API отклонил этот ключ Gemini:\n"${lastError}"\n\n`;
      if (
        lastError.includes("ACCESS_TOKEN_TYPE_UNSUPPORTED") ||
        lastError.includes("API key not valid") ||
        lastError.includes("UNAUTHENTICATED")
      ) {
        diagnosticReply += `💡 **Почему это произошло:**\nКлючи нового формата Google AI Studio (начинаются на AQ.) привязаны к проекту Google Cloud. В консоли Cloud нужно:\n1. Зайти в APIs & Services -> Library и включить **"Generative Language API"** (именно его, а не "Gemini API").\n2. Либо снять ограничения по API в настройках ключа.\n\n⚡ **Или решение за 10 секунд (рекомендую):**\nПодключи бесплатный ключ **Groq** (начни с \`gsk_\` на console.groq.com/keys) — он создается в 1 клик через Google, без Google Cloud, без карт и выдает умнейшую модель Llama 3.3 70B со скоростью 0.3 сек!`;
      } else if (lastError.includes("SERVICE_DISABLED") || lastError.includes("has not been used")) {
        diagnosticReply += `💡 В твоем Google Cloud проекте отключен **Generative Language API**.\nВключи его в Google Cloud Console или используй бесплатный ключ Groq (\`gsk_...\`).`;
      } else if (lastError.includes("location") || lastError.includes("country")) {
        diagnosticReply += `💡 Google блокирует прямые запросы к Gemini из твоего региона.\nИспользуй ключ Groq (\`gsk_...\`) — в нем нет региональных ограничений!`;
      } else {
        diagnosticReply += `💡 Проверь правильность ключа или переключись на бесплатный ключ Groq (\`gsk_...\`) на console.groq.com.`;
      }

      return NextResponse.json({ reply: diagnosticReply });
    }

    // 2. If key is Groq / OpenRouter / OpenAI (gsk_... or sk-or-... or sk-...)
    if (rawKey && (rawKey.startsWith("sk-") || rawKey.startsWith("gsk_"))) {
      try {
        const isGroq = rawKey.startsWith("gsk_");
        const isOpenRouter = rawKey.startsWith("sk-or-");
        const providerName = isGroq ? "Groq" : isOpenRouter ? "OpenRouter" : "OpenAI";

        const endpoint = isGroq
          ? "https://api.groq.com/openai/v1/chat/completions"
          : isOpenRouter
          ? "https://openrouter.ai/api/v1/chat/completions"
          : "https://api.openai.com/v1/chat/completions";

        let candidateModels: string[] = [];

        if (isGroq) {
          // Dynamic model discovery: fetch exact active models available to this specific Groq key
          try {
            const modelsRes = await fetch("https://api.groq.com/openai/v1/models", {
              headers: { Authorization: `Bearer ${rawKey}` },
            });

            if (modelsRes.ok) {
              const modelsJson = await modelsRes.json();
              const activeIds: string[] = (modelsJson.data || [])
                .map((m: any) => m.id as string)
                .filter(
                  (id: string) =>
                    id &&
                    !id.includes("whisper") &&
                    !id.includes("guard") &&
                    !id.includes("embed") &&
                    !id.includes("tts")
                );

              // Sort prioritizing versatile & high quality models:
              // 1. llama-3.3-70b-versatile or 70b / 120b
              // 2. llama-3.1 / llama3 / qwen
              // 3. other instruct models
              activeIds.sort((a, b) => {
                const getWeight = (id: string) => {
                  let w = 0;
                  if (id.includes("llama-3.3-70b")) w += 100;
                  else if (id.includes("70b") || id.includes("120b")) w += 80;
                  else if (id.includes("llama-3.3")) w += 70;
                  else if (id.includes("llama-3.1")) w += 60;
                  else if (id.includes("llama3")) w += 50;
                  else if (id.includes("qwen")) w += 40;
                  else if (id.includes("mixtral")) w += 30;
                  else if (id.includes("gemma")) w += 20;
                  return w;
                };
                return getWeight(b) - getWeight(a);
              });

              if (activeIds.length > 0) {
                candidateModels = activeIds;
              }
            } else {
              const err = await modelsRes.json().catch(() => ({}));
              if (err?.error?.message) {
                return NextResponse.json({
                  reply: `⚠️ Ошибка авторизации Groq: ${err.error.message}`,
                });
              }
            }
          } catch (e) {
            // fallback if discovery endpoint fails
          }

          if (candidateModels.length === 0) {
            candidateModels = [
              "llama-3.3-70b-versatile",
              "llama-3.1-70b-versatile",
              "llama-3.2-3b-preview",
              "llama-3.2-1b-preview",
              "llama3-70b-8192",
              "llama3-8b-8192",
              "mixtral-8x7b-32768",
              "gemma2-9b-it",
            ];
          }
        } else if (isOpenRouter) {
          candidateModels = [
            "meta-llama/llama-3.3-70b-instruct:free",
            "google/gemini-2.0-flash-exp:free",
            "deepseek/deepseek-chat:free",
            "qwen/qwen-2.5-72b-instruct:free",
          ];
        } else {
          candidateModels = ["gpt-4o-mini", "gpt-3.5-turbo"];
        }

        const errorsLog: string[] = [];

        for (const model of candidateModels) {
          try {
            const headers: Record<string, string> = {
              "Content-Type": "application/json",
              Authorization: `Bearer ${rawKey}`,
            };

            if (isOpenRouter) {
              headers["HTTP-Referer"] = "https://lifeos-tracker-two.vercel.app";
              headers["X-Title"] = "LifeOS Tracker";
            }

            const oaiRes = await fetch(endpoint, {
              method: "POST",
              headers,
              body: JSON.stringify({
                model,
                messages: [
                  { role: "system", content: systemInstruction },
                  { role: "user", content: prompt },
                ],
                temperature: 0.7,
                max_tokens: 1024,
              }),
            });

            if (oaiRes.ok) {
              const oaiData = await oaiRes.json();
              const reply = oaiData.choices?.[0]?.message?.content;
              if (reply) {
                return NextResponse.json({ reply });
              }
            } else {
              const errData = await oaiRes.json().catch(() => ({}));
              const msg = errData?.error?.message || oaiRes.statusText;
              errorsLog.push(`${model}: ${msg}`);
            }
          } catch (modelErr: any) {
            errorsLog.push(`${model}: ${modelErr?.message || String(modelErr)}`);
          }
        }

        return NextResponse.json({
          reply: `⚠️ Ошибка провайдера ${providerName}:\n${errorsLog.slice(0, 3).join("\n")}`,
        });
      } catch (e: any) {
        return NextResponse.json({
          reply: `⚠️ Ошибка соединения с ИИ: ${e?.message}`,
        });
      }
    }

    // 3. Fallback knowledge engine (when no API key is specified)
    const reply = getSmartFallbackResponse(prompt, userContext);
    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json(
      { reply: "Я на связи! Спроси о тренировках, накоплениях на Пассат, 3D-печати или задачах." },
      { status: 200 }
    );
  }
}
