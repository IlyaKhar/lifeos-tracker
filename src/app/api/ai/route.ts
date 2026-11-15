import { NextResponse } from "next/server";

// Smart built-in offline responses for instant free help without API key!
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

  if (p.includes("книг") || p.includes("чита") || p.includes("учеб") || p.includes("работ") || p.includes("задач")) {
    return `📚 **Как читать и учиться без прокрастинации:**
1. **Правило 10 страниц:** Читай каждый день минимум 10 страниц. Это 300 страниц в месяц — ровно одна хорошая книга!
2. **Pomodoro 25/5:** 25 минут полного фокуса с выключенными уведомлениями + 5 минут разминки. За 4 сессии делается норма целого дня!`;
  }

  return `🤖 Привет! Я твой AI-коуч в LifeOS. Могу составить программу тренировок, расписать бюджет, подсказать расчет цен в 3D-печати или английские фразы. Чтобы общаться на любые темы в свободном формате, подключи бесплатный ключ Gemini по иконке 🔑 вверху!`;
}

export async function POST(req: Request) {
  try {
    const { prompt, userContext, apiKey } = await req.json();

    const geminiKey = apiKey || process.env.GEMINI_API_KEY;

    // If Gemini API key is provided, query Google Gemini Live!
    if (geminiKey) {
      const systemInstruction = `Ты — Алина, умный, поддерживающий и практичный AI-коуч в приложении LifeOS. Пользователя зовут Илья. Отвечай кратко, без лишней воды, дружелюбно и по делу на русском языке. При необходимости давай конкретные цифры и шаги.`;
      
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${systemInstruction}\n\nКонтекст пользователя: ${JSON.stringify(userContext || {})}\n\nВопрос Ильи: ${prompt}` }],
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
      { reply: "Извини, произошла ошибка соединения. Но я всегда готова помочь с тренировками и целями!" },
      { status: 200 }
    );
  }
}
