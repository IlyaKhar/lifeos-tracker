import { NextResponse } from "next/server";

// Smart built-in offline responses for instant free help without API key!
function getSmartFallbackResponse(prompt: string, context?: any): string {
  const p = prompt.toLowerCase();

  if (p.includes("пасат") || p.includes("пассат") || p.includes("копилк") || p.includes("накоп")) {
    return `🚗 **План накоплений на Volkswagen Passat B6 (700 000 ₽):**
1. **Ежемесячный темп:** При откладывании 30 000 ₽/мес цель закроется за ~23 месяца. Если форсировать до 50 000 ₽ — за 14 месяцев!
2. **Тактика чекпоинтов:**
   * Этап 1 (175 000 ₽ / 25%): Психологический рубеж — отпраздновать и не сбавлять темп.
   * Этап 2 (350 000 ₽ / 50%): Экватор — можно начинать мониторить рынок и живые комплектации (2.0 TDI / 1.8 TSI на надежной механике).
   * Этап 3 (700 000 ₽): Покупка + резерв 50 000 ₽ на ТО и жидкости.
3. **Совет:** Настрой автопополнение в день зарплаты сразу в копилку!`;
  }

  if (p.includes("программ") || p.includes("зал") || p.includes("трен") || p.includes("мышц") || p.includes("жим")) {
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

💡 *Правило:* Отдых между тяжелыми подходами 90-120 сек, добавляй по 1-2.5 кг как только закрываешь все повторения.`;
  }

  if (p.includes("3d") || p.includes("печать") || p.includes("сопл") || p.includes("petg") || p.includes("pla") || p.includes("стол")) {
    return `🖨️ **Шпаргалка 3D-мейкера по температурам и адгезии:**
* **PLA:** Сопло 205-215°C, Стол 55-60°C. Обдув 100%. Идеально для корпусов и прототипов.
* **PETG:** Сопло 230-240°C, Стол 75-85°C. Обдув 30-50%. Важно: первый слой печатать чуть медленнее (20 мм/с) для идеального сцепления.
* **Лайфхак от отлипания:** Обезжирить стол спиртом (IPA) и выставить Z-offset с зазором в лист бумаги (0.1 мм).`;
  }

  if (p.includes("англ") || p.includes("english") || p.includes("слов")) {
    return `🇬🇧 **5 полезных разговорных выражений для IT и жизни:**
1. *"Let's cut to the chase"* — Давайте сразу к делу (без лишних слов).
2. *"It's up to you"* — Решай сам / на твоё усмотрение.
3. *"I'll keep you posted"* — Буду держать тебя в курсе.
4. *"Hit the gym"* — Пойти потренить в зал.
5. *"Under the hood"* — То, как устроено внутри (под капотом).`;
  }

  return `🤖 Привет! Я твой встроенный AI-коуч в LifeOS. Могу помочь составить программу тренировок, рассчитать калории, дать советы по 3D-печати или составить финансовый план! Спроси меня о чем угодно.`;
}

export async function POST(req: Request) {
  try {
    const { prompt, userContext, apiKey } = await req.json();

    const geminiKey = apiKey || process.env.GEMINI_API_KEY;

    // If Gemini API key is provided, query Google Gemini Live!
    if (geminiKey) {
      const systemInstruction = `Ты — Алина, умный и поддерживающий AI-коуч в приложении LifeOS. Пользователя зовут Илья. Отвечай кратко, практично, дружелюбно и по делу на русском языке. Контекст пользователя: ${JSON.stringify(userContext || {})}`;
      
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${systemInstruction}\n\nВопрос: ${prompt}` }],
              },
            ],
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return NextResponse.json({ reply: text });
        }
      }
    }

    // Fallback to our high-quality built-in knowledge engine!
    const reply = getSmartFallbackResponse(prompt, userContext);
    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json(
      { reply: "Извини, произошла ошибка. Но я всегда готова помочь с тренировками и целями!" },
      { status: 200 }
    );
  }
}
