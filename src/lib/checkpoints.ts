import { Checkpoint, UserProfile } from "@/types";

export function generateSmartCheckpoints(profile: UserProfile): Checkpoint[] {
  const list: Checkpoint[] = [];
  const now = new Date().toISOString();

  // 1. ВЕС И ТЕЛО
  if (profile.fitnessGoal === "lose_weight") {
    const diff = +(profile.currentWeight - profile.targetWeight).toFixed(1);
    const midPoint = +(profile.currentWeight - diff / 2).toFixed(1);

    list.push({
      id: "cp_weight_mid",
      category: "gym",
      title: `Экватор сушки: ${midPoint} кг`,
      description: `Сбросить первые ${(diff / 2).toFixed(1)} кг от стартовых ${profile.currentWeight} кг`,
      badge: "scale",
      currentValue: 0,
      targetValue: diff / 2,
      unit: "кг",
      completed: false,
      createdAt: now,
    });

    list.push({
      id: "cp_weight_goal",
      category: "gym",
      title: `Идеальная форма: ${profile.targetWeight} кг`,
      description: `Достичь финального целевого веса`,
      badge: "trophy",
      currentValue: 0,
      targetValue: diff,
      unit: "кг",
      completed: false,
      createdAt: now,
    });
  } else if (profile.fitnessGoal === "build_muscle" || profile.fitnessGoal === "strength") {
    list.push({
      id: "cp_gym_workouts",
      category: "gym",
      title: "Железная дисциплина: 12 тренировок",
      description: "Провести 12 качественных силовых тренировок по программе",
      badge: "dumbbell",
      currentValue: 1,
      targetValue: 12,
      unit: "трен.",
      completed: false,
      createdAt: now,
    });

    list.push({
      id: "cp_gym_pr",
      category: "gym",
      title: "Новый рекорд (PR) в жиме штанги",
      description: "Прибавить +2.5 кг к рабочему максимуму",
      badge: "zap",
      currentValue: 85,
      targetValue: 90,
      unit: "кг",
      completed: false,
      createdAt: now,
    });
  }

  // 2. ФИНАНСЫ И НАКОПЛЕНИЯ
  if (profile.savingsTargetAmount > 0) {
    const quarter = Math.round(profile.savingsTargetAmount * 0.25);

    list.push({
      id: "cp_savings_quarter",
      category: "savings",
      title: `Первые 25% на «${profile.savingsTargetName || "Цель"}»`,
      description: `Отложить первые ${quarter.toLocaleString("ru-RU")} ₽ в копилку`,
      badge: "wallet",
      currentValue: 0,
      targetValue: quarter,
      unit: "₽",
      completed: false,
      createdAt: now,
    });

    list.push({
      id: "cp_savings_full",
      category: "savings",
      title: `Финал мечты: ${profile.savingsTargetAmount.toLocaleString("ru-RU")} ₽`,
      description: `Полностью закрыть цель «${profile.savingsTargetName || "Цель"}»`,
      badge: "sparkles",
      currentValue: 0,
      targetValue: profile.savingsTargetAmount,
      unit: "₽",
      completed: false,
      createdAt: now,
    });
  }

  // 3. 3D ПЕЧАТЬ
  list.push({
    id: "cp_3d_queue",
    category: "3d",
    title: "Идеальная адгезия: 5 удачных печатей",
    description: "Напечатать 5 моделей подряд без деламинации и брака",
    badge: "layers",
    currentValue: 1,
    targetValue: 5,
    unit: "шт.",
    completed: false,
    createdAt: now,
  });

  // 4. КНИГИ & АНГЛИЙСКИЙ
  list.push({
    id: "cp_english_vocab",
    category: "english",
    title: "Словарный буст: +50 новых слов",
    description: "Пополнить активный словарь английского языка",
    badge: "languages",
    currentValue: 20,
    targetValue: 50,
    unit: "слов",
    completed: false,
    createdAt: now,
  });

  list.push({
    id: "cp_books_finish",
    category: "reading",
    title: "Финиш книги: Чистый код",
    description: "Прочитать оставшиеся страницы книги",
    badge: "book-open",
    currentValue: 142,
    targetValue: 320,
    unit: "стр.",
    completed: false,
    createdAt: now,
  });

  return list;
}
