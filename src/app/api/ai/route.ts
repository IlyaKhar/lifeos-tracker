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

      // Try direct REST fetch with x-goog-api-key header (vital for newer AQ. keys)
      for (const model of ["gemini-2.0-flash", "gemini-1.5-flash"]) {
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
        const endpoint = isGroq
          ? "https://api.groq.com/openai/v1/chat/completions"
          : isOpenRouter
          ? "https://openrouter.ai/api/v1/chat/completions"
          : "https://api.openai.com/v1/chat/completions";

        const model = isGroq
          ? "llama-3.3-70b-versatile"
          : isOpenRouter
          ? "google/gemini-2.0-flash-exp:free"
          : "gpt-4o-mini";

        const oaiRes = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${rawKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemInstruction },
              { role: "user", content: prompt },
            ],
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
          return NextResponse.json({
            reply: `⚠️ Ошибка провайдера ${isGroq ? "Groq" : "OpenRouter"}: ${errData?.error?.message || oaiRes.statusText}`,
          });
        }
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
