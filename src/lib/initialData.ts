import { ModuleItem, FilamentSpool, PrintJob, SavingsGoal, Book, DailyHabit, WorkoutSession, BodyWeightLog } from "@/types";

export const initialModules: ModuleItem[] = [
  {
    id: "gym",
    title: "Зал & Тело",
    subtitle: "Прогрессия весов и замеры",
    category: "gym",
    icon: "dumbbell",
    accentColor: "emerald",
    borderColor: "border-white/[0.06] hover:border-emerald-500/40",
    previewValue: "78.4 кг",
    previewSubtext: "Жим: 85 кг × 6 (PR)",
  },
  {
    id: "3d",
    title: "3D Печать",
    subtitle: "Катушки и очередь печати",
    category: "3d",
    icon: "layers",
    accentColor: "orange",
    borderColor: "border-white/[0.06] hover:border-orange-500/40",
    previewValue: "68%",
    previewSubtext: "Корпус Raspberry Pi",
  },
  {
    id: "savings",
    title: "Накопления",
    subtitle: "Финансовые цели и копилки",
    category: "savings",
    icon: "wallet",
    accentColor: "amber",
    borderColor: "border-white/[0.06] hover:border-amber-500/40",
    previewValue: "0 ₽",
    previewSubtext: "Пассат Б6 (0%)",
  },
  {
    id: "english",
    title: "Английский",
    subtitle: "Словарный запас и практика",
    category: "english",
    icon: "languages",
    accentColor: "sky",
    borderColor: "border-white/[0.06] hover:border-sky-500/40",
    previewValue: "0 слов",
    previewSubtext: "Словарь пуст",
  },
  {
    id: "reading",
    title: "Книги",
    subtitle: "Трекинг страниц и скорость",
    category: "reading",
    icon: "book-open",
    accentColor: "purple",
    borderColor: "border-white/[0.06] hover:border-purple-500/40",
    previewValue: "0 книг",
    previewSubtext: "Добавь книгу",
  },
  {
    id: "work",
    title: "Учеба & Работа",
    subtitle: "Pomodoro и фокус дня",
    category: "work",
    icon: "briefcase",
    accentColor: "indigo",
    borderColor: "border-white/[0.06] hover:border-indigo-500/40",
    previewValue: "3 задачи",
    previewSubtext: "2.5 ч фокуса",
  },
];

export const initialWeightLogs: BodyWeightLog[] = [
  { id: "1", date: "2026-11-09", weightKg: 79.2 },
  { id: "2", date: "2026-11-10", weightKg: 79.0 },
  { id: "3", date: "2026-11-11", weightKg: 78.8 },
  { id: "4", date: "2026-11-12", weightKg: 78.9 },
  { id: "5", date: "2026-11-13", weightKg: 78.6 },
  { id: "6", date: "2026-11-14", weightKg: 78.5 },
  { id: "7", date: "2026-11-15", weightKg: 78.4 },
];

export const initialWorkouts: WorkoutSession[] = [
  {
    id: "w1",
    date: "2026-11-14",
    name: "Грудь и Плечи (Силовая A)",
    durationMinutes: 65,
    notes: "Отличный темп, прибавил в жиме!",
    exercises: [
      {
        id: "e1",
        name: "Жим штанги лежа",
        targetSets: 3,
        isPR: true,
        sets: [
          { id: "s1", setNumber: 1, weightKg: 80, reps: 10, completed: true, rpe: 8 },
          { id: "s2", setNumber: 2, weightKg: 82.5, reps: 8, completed: true, rpe: 8.5 },
          { id: "s3", setNumber: 3, weightKg: 85, reps: 6, completed: true, rpe: 9.5 },
        ],
      },
      {
        id: "e2",
        name: "Армейский жим стоя",
        targetSets: 3,
        sets: [
          { id: "s4", setNumber: 1, weightKg: 40, reps: 10, completed: true, rpe: 7.5 },
          { id: "s5", setNumber: 2, weightKg: 45, reps: 8, completed: true, rpe: 8 },
          { id: "s6", setNumber: 3, weightKg: 45, reps: 7, completed: true, rpe: 9 },
        ],
      },
      {
        id: "e3",
        name: "Разводка гантелей в наклоне",
        targetSets: 3,
        sets: [
          { id: "s7", setNumber: 1, weightKg: 12, reps: 12, completed: true },
          { id: "s8", setNumber: 2, weightKg: 14, reps: 10, completed: true },
          { id: "s9", setNumber: 3, weightKg: 14, reps: 10, completed: true },
        ],
      },
    ],
  },
];

export const initialSpools: FilamentSpool[] = [
  {
    id: "sp1",
    brand: "Kingroon",
    material: "PLA",
    colorName: "Black",
    colorHex: "#1e222d",
    totalWeightGrams: 1000,
    remainingWeightGrams: 680,
    nozzleTemp: 210,
    bedTemp: 60,
    priceRub: 1200,
  },
  {
    id: "sp2",
    brand: "FDPlast",
    material: "PETG",
    colorName: "Cyan",
    colorHex: "#06b6d4",
    totalWeightGrams: 1000,
    remainingWeightGrams: 320,
    nozzleTemp: 235,
    bedTemp: 80,
    priceRub: 950,
  },
  {
    id: "sp3",
    brand: "eSUN",
    material: "PLA",
    colorName: "Matte White",
    colorHex: "#f1f5f9",
    totalWeightGrams: 1000,
    remainingWeightGrams: 910,
    nozzleTemp: 205,
    bedTemp: 55,
    priceRub: 1600,
  },
];

export const initialPrintJobs: PrintJob[] = [
  {
    id: "pj1",
    title: "Корпус Raspberry Pi 5 v2",
    spoolId: "sp1",
    weightGrams: 45,
    estimatedDuration: "2ч 30м",
    costRub: 54,
    status: "printing",
    progressPercent: 68,
    dateAdded: "2026-11-15 13:20",
  },
  {
    id: "pj2",
    title: "Крепление наушников под стол",
    spoolId: "sp2",
    weightGrams: 85,
    estimatedDuration: "4ч 10м",
    costRub: 81,
    status: "queued",
    progressPercent: 0,
    dateAdded: "2026-11-15 14:00",
  },
];

export const initialSavingsGoals: SavingsGoal[] = [
  {
    id: "sg_main",
    title: "Пассат Б6",
    icon: "car",
    targetAmount: 700000,
    currentAmount: 0,
    currency: "₽",
    color: "amber",
  },
];

export const initialBooks: Book[] = [];

export const initialHabits: DailyHabit[] = [
  { id: "h1", title: "Тренировка в зале", icon: "dumbbell", completed: true, streakDays: 4 },
  { id: "h2", title: "20 новых слов в English", icon: "languages", completed: true, streakDays: 12 },
  { id: "h3", title: "Чтение 20 страниц", icon: "book-open", completed: false, streakDays: 8 },
  { id: "h4", title: "Ревью кода и задачи по работе", icon: "briefcase", completed: false, streakDays: 19 },
];
