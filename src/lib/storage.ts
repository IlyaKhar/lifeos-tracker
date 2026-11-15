import {
  ModuleItem,
  BodyWeightLog,
  WorkoutSession,
  FilamentSpool,
  PrintJob,
  SavingsGoal,
  Book,
  DailyHabit,
  UserProfile,
  Checkpoint,
  PrintModelItem,
  WorkTask,
  TradeProduct,
  TradeSale,
} from "@/types";
import {
  initialModules,
  initialWeightLogs,
  initialWorkouts,
  initialSpools,
  initialPrintJobs,
  initialSavingsGoals,
  initialBooks,
  initialHabits,
} from "./initialData";
import { generateSmartCheckpoints } from "./checkpoints";

const STORAGE_KEYS = {
  PROFILE: "lifeos_profile_v1",
  CHECKPOINTS: "lifeos_checkpoints_v1",
  MODULES: "lifeos_modules_v1",
  WEIGHT_LOGS: "lifeos_weight_logs_v1",
  WORKOUTS: "lifeos_workouts_v1",
  SPOOLS: "lifeos_spools_v1",
  PRINT_JOBS: "lifeos_print_jobs_v1",
  PRINT_MODELS: "lifeos_print_models_v1",
  SAVINGS: "lifeos_savings_v1",
  BOOKS: "lifeos_books_v1",
  WORK_TASKS: "lifeos_work_tasks_v1",
  HABITS: "lifeos_habits_v1",
  WATER_ML: "lifeos_water_ml_v1",
  ENGLISH_WORDS: "lifeos_english_words_v1",
  ENGLISH_MINUTES: "lifeos_english_min_v1",
  TRADE_PRODUCTS: "lifeos_trade_products_v1",
  TRADE_SALES: "lifeos_trade_sales_v1",
};

export interface WordItem {
  id: string;
  word: string;
  translation: string;
  date: string;
}

const defaultProfile: UserProfile = {
  name: "Илья",
  age: 22,
  currentWeight: 78.4,
  targetWeight: 75.0,
  fitnessGoal: "lose_weight",
  focusCategories: ["gym", "3d", "savings", "reading", "english", "work"],
  savingsTargetName: "Пассат Б6",
  savingsTargetAmount: 700000,
  isOnboarded: false,
  createdAt: new Date().toISOString(),
};

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

export const StorageService = {
  getProfile: (): UserProfile => safeGet(STORAGE_KEYS.PROFILE, defaultProfile),
  saveProfile: (profile: UserProfile): void => {
    safeSet(STORAGE_KEYS.PROFILE, profile);
    const checkpoints = generateSmartCheckpoints(profile);
    safeSet(STORAGE_KEYS.CHECKPOINTS, checkpoints);

    // Sync savings goal with profile!
    if (profile.savingsTargetName && profile.savingsTargetAmount) {
      const currentGoals = StorageService.getSavingsGoals();
      const existingMain = currentGoals.find((g) => g.id === "sg_main");
      const updatedGoals = [
        {
          id: "sg_main",
          title: profile.savingsTargetName,
          icon: "car",
          targetAmount: profile.savingsTargetAmount,
          currentAmount: existingMain ? existingMain.currentAmount : 0,
          currency: "₽",
          color: "amber",
        },
        ...currentGoals.filter((g) => g.id !== "sg_main" && g.id !== "sg1"),
      ];
      StorageService.saveSavingsGoals(updatedGoals);
    }

    // Sync weight log
    StorageService.addWeightLog(profile.currentWeight);
  },

  // Checkpoints
  getCheckpoints: (): Checkpoint[] => {
    const profile = StorageService.getProfile();
    const fallback = generateSmartCheckpoints(profile);
    return safeGet(STORAGE_KEYS.CHECKPOINTS, fallback);
  },
  saveCheckpoints: (cps: Checkpoint[]): void => safeSet(STORAGE_KEYS.CHECKPOINTS, cps),
  toggleCheckpoint: (id: string): Checkpoint[] => {
    const current = StorageService.getCheckpoints();
    const updated = current.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c));
    StorageService.saveCheckpoints(updated);
    return updated;
  },
  updateCheckpoint: (updatedCp: Checkpoint): Checkpoint[] => {
    const current = StorageService.getCheckpoints();
    const updated = current.map((c) => (c.id === updatedCp.id ? updatedCp : c));
    StorageService.saveCheckpoints(updated);
    return updated;
  },
  addCheckpoint: (newCp: Checkpoint): Checkpoint[] => {
    const current = StorageService.getCheckpoints();
    const updated = [newCp, ...current];
    StorageService.saveCheckpoints(updated);
    return updated;
  },
  deleteCheckpoint: (id: string): Checkpoint[] => {
    const current = StorageService.getCheckpoints();
    const updated = current.filter((c) => c.id !== id);
    StorageService.saveCheckpoints(updated);
    return updated;
  },

  // Dynamic Modules: ALWAYS strictly computed from actual live state (Zero desync!)
  getModules: (): ModuleItem[] => {
    const savedCustomModules = safeGet<ModuleItem[]>(STORAGE_KEYS.MODULES, initialModules)
      .filter((m) => m.category === "custom");

    // 1. Gym (Weekly progress calculation)
    const weightLogs = StorageService.getWeightLogs();
    const currentWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weightKg : 78.4;
    let weightTrend = "";
    if (weightLogs.length >= 2) {
      const prevLog = weightLogs[Math.max(0, weightLogs.length - 7)];
      const diff = +(currentWeight - prevLog.weightKg).toFixed(1);
      if (diff !== 0) {
        weightTrend = ` (${diff > 0 ? `+${diff}` : diff} кг/нед)`;
      }
    }
    const workouts = StorageService.getWorkouts();
    const workoutsCount = workouts.length;
    const lastWorkout = workouts.length > 0 ? workouts[0].name : "Прогрессия весов";
    const gymPreviewSub = workoutsCount > 0 ? `${workoutsCount} трен. • ${lastWorkout}` : "Прогрессия весов";

    // 2. Savings
    const savingsGoals = StorageService.getSavingsGoals();
    const totalSaved = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
    const mainGoal = savingsGoals[0];
    const savingsSubtext = mainGoal
      ? `${mainGoal.title} (${Math.round((mainGoal.currentAmount / mainGoal.targetAmount) * 100)}%)`
      : "Цели и копилки";

    // 3. 3D Printing (Custom Orders & Models)
    const printModels = StorageService.getPrintModels();
    const totalEarned = printModels
      .filter((m) => m.modelType === "custom_order")
      .reduce((sum, m) => sum + (m.priceRub || 0), 0);
    const totalPieces = printModels.reduce((sum, m) => sum + (m.quantity || 1), 0);
    const printSubtext = totalPieces > 0 ? `${totalPieces} шт. напечатано` : "0 шт. напечатано";

    // 4. English
    const words = StorageService.getEnglishWords();
    const engSubtext = words.length > 0 ? "Словарь пополнен" : "Словарь пуст";

    // 5. Books
    const books = StorageService.getBooks();
    const activeBook = books.find((b) => b.status === "reading");
    const bookValue = activeBook
      ? `${activeBook.currentPage} / ${activeBook.totalPages}`
      : `${books.length} книг`;
    const bookSubtext = activeBook
      ? `${activeBook.title} (${Math.round((activeBook.currentPage / activeBook.totalPages) * 100)}%)`
      : books.length > 0
      ? "Книжная полка"
      : "Полка пуста";

    // 6. Work & Study Tasks
    const tasks = StorageService.getWorkTasks();
    const pendingTasks = tasks.filter((t) => !t.completed).length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const workSubtext = completedTasks > 0
      ? `${completedTasks} задач закрыто`
      : "Фокус-сессии дня";

    // 7. Trade (Товарка & Бизнес)
    const tradeProducts = StorageService.getTradeProducts();
    const tradeSales = StorageService.getTradeSales();
    const totalTradeProfit = tradeSales.reduce((sum, s) => sum + (s.profitRub || 0), 0);
    const totalItemsInStock = tradeProducts.reduce((sum, p) => sum + (p.stockQuantity || 0), 0);
    const tradeSubtext = tradeSales.length > 0
      ? `${tradeSales.length} продаж • ${totalItemsInStock} шт на складе`
      : totalItemsInStock > 0
      ? `${totalItemsInStock} шт на складе`
      : "Учет закупок и продаж";

    const standardModules: ModuleItem[] = [
      {
        id: "gym",
        title: "Зал & Тело",
        subtitle: "Прогрессия весов и замеры",
        category: "gym",
        icon: "dumbbell",
        accentColor: "emerald",
        borderColor: "border-white/[0.06] hover:border-emerald-500/40",
        previewValue: `${currentWeight} кг${weightTrend}`,
        previewSubtext: gymPreviewSub,
      },
      {
        id: "trade",
        title: "Товарка & Бизнес",
        subtitle: "Склад, продажи и прибыль",
        category: "trade",
        icon: "package",
        accentColor: "rose",
        borderColor: "border-white/[0.06] hover:border-rose-500/40",
        previewValue: totalTradeProfit > 0 ? `+${totalTradeProfit.toLocaleString("ru-RU")} ₽` : "0 ₽",
        previewSubtext: tradeSubtext,
      },
      {
        id: "3d",
        title: "3D Печать",
        subtitle: "Катушки и журнал заказов",
        category: "3d",
        icon: "layers",
        accentColor: "orange",
        borderColor: "border-white/[0.06] hover:border-orange-500/40",
        previewValue: totalEarned > 0 ? `${totalEarned.toLocaleString("ru-RU")} ₽` : "0 ₽",
        previewSubtext: printSubtext,
      },
      {
        id: "savings",
        title: "Накопления",
        subtitle: "Финансовые цели и копилки",
        category: "savings",
        icon: "wallet",
        accentColor: "amber",
        borderColor: "border-white/[0.06] hover:border-amber-500/40",
        previewValue: `${totalSaved.toLocaleString("ru-RU")} ₽`,
        previewSubtext: savingsSubtext,
      },
      {
        id: "english",
        title: "Английский",
        subtitle: "Словарный запас и практика",
        category: "english",
        icon: "languages",
        accentColor: "sky",
        borderColor: "border-white/[0.06] hover:border-sky-500/40",
        previewValue: `${words.length} слов`,
        previewSubtext: engSubtext,
      },
      {
        id: "reading",
        title: "Книги",
        subtitle: "Трекинг страниц и скорость",
        category: "reading",
        icon: "book-open",
        accentColor: "purple",
        borderColor: "border-white/[0.06] hover:border-purple-500/40",
        previewValue: bookValue,
        previewSubtext: bookSubtext,
      },
      {
        id: "work",
        title: "Учеба & Работа",
        subtitle: "Pomodoro и дедлайны задач",
        category: "work",
        icon: "briefcase",
        accentColor: "indigo",
        borderColor: "border-white/[0.06] hover:border-indigo-500/40",
        previewValue: `${pendingTasks} задач`,
        previewSubtext: workSubtext,
      },
      ...savedCustomModules,
    ];

    return standardModules;
  },
  saveModules: (modules: ModuleItem[]) => safeSet(STORAGE_KEYS.MODULES, modules),

  // Weight
  getWeightLogs: (): BodyWeightLog[] => safeGet(STORAGE_KEYS.WEIGHT_LOGS, initialWeightLogs),
  saveWeightLogs: (logs: BodyWeightLog[]) => safeSet(STORAGE_KEYS.WEIGHT_LOGS, logs),
  addWeightLog: (weightKg: number): BodyWeightLog[] => {
    const current = StorageService.getWeightLogs();
    const today = new Date().toISOString().split("T")[0];
    const updated = [
      ...current.filter((l) => l.date !== today),
      { id: Date.now().toString(), date: today, weightKg },
    ].sort((a, b) => a.date.localeCompare(b.date));
    StorageService.saveWeightLogs(updated);
    return updated;
  },
  deleteWeightLog: (id: string): BodyWeightLog[] => {
    const current = StorageService.getWeightLogs();
    const updated = current.filter((l) => l.id !== id);
    StorageService.saveWeightLogs(updated);
    return updated;
  },

  // Workouts (Full Customization)
  getWorkouts: (): WorkoutSession[] => safeGet(STORAGE_KEYS.WORKOUTS, initialWorkouts),
  saveWorkouts: (workouts: WorkoutSession[]) => safeSet(STORAGE_KEYS.WORKOUTS, workouts),
  addWorkout: (workout: WorkoutSession): WorkoutSession[] => {
    const current = StorageService.getWorkouts();
    const updated = [workout, ...current];
    StorageService.saveWorkouts(updated);
    return updated;
  },
  deleteWorkout: (id: string): WorkoutSession[] => {
    const current = StorageService.getWorkouts();
    const updated = current.filter((w) => w.id !== id);
    StorageService.saveWorkouts(updated);
    return updated;
  },

  // 3D Spools
  getSpools: (): FilamentSpool[] => safeGet(STORAGE_KEYS.SPOOLS, initialSpools),
  saveSpools: (spools: FilamentSpool[]) => safeSet(STORAGE_KEYS.SPOOLS, spools),
  deleteSpool: (id: string): FilamentSpool[] => {
    const current = StorageService.getSpools();
    const updated = current.filter((s) => s.id !== id);
    StorageService.saveSpools(updated);
    return updated;
  },

  // 3D Models & Orders (New: For Myself vs Custom Orders)
  getPrintModels: (): PrintModelItem[] => safeGet(STORAGE_KEYS.PRINT_MODELS, []),
  savePrintModels: (models: PrintModelItem[]) => safeSet(STORAGE_KEYS.PRINT_MODELS, models),
  addPrintModel: (model: PrintModelItem): PrintModelItem[] => {
    const current = StorageService.getPrintModels();
    const updated = [model, ...current];
    StorageService.savePrintModels(updated);

    // Optionally deduct filament if spoolId was selected
    if (model.spoolId && model.weightGrams > 0) {
      const spools = StorageService.getSpools();
      const updatedSpools = spools.map((s) => {
        if (s.id === model.spoolId) {
          return {
            ...s,
            remainingWeightGrams: Math.max(0, s.remainingWeightGrams - model.weightGrams),
          };
        }
        return s;
      });
      StorageService.saveSpools(updatedSpools);
    }

    return updated;
  },
  updatePrintModel: (updatedModel: PrintModelItem): PrintModelItem[] => {
    const current = StorageService.getPrintModels();
    const updated = current.map((m) => (m.id === updatedModel.id ? updatedModel : m));
    StorageService.savePrintModels(updated);
    return updated;
  },
  deletePrintModel: (id: string): PrintModelItem[] => {
    const current = StorageService.getPrintModels();
    const updated = current.filter((m) => m.id !== id);
    StorageService.savePrintModels(updated);
    return updated;
  },

  // Savings
  getSavingsGoals: (): SavingsGoal[] => {
    const raw = safeGet<SavingsGoal[]>(STORAGE_KEYS.SAVINGS, initialSavingsGoals);
    // Auto-purge old mock goal "sg1" (Bambu Lab 65 000 ₽) that caused desync
    const cleaned = raw.filter((g) => g.id !== "sg1");
    return cleaned.length > 0 ? cleaned : initialSavingsGoals;
  },
  saveSavingsGoals: (goals: SavingsGoal[]) => safeSet(STORAGE_KEYS.SAVINGS, goals),
  deleteSavingsGoal: (id: string): SavingsGoal[] => {
    const current = StorageService.getSavingsGoals();
    const updated = current.filter((g) => g.id !== id);
    StorageService.saveSavingsGoals(updated);
    return updated;
  },
  depositSavings: (goalId: string, amount: number): SavingsGoal[] => {
    const goals = StorageService.getSavingsGoals().map((g) => {
      if (g.id === goalId) {
        return { ...g, currentAmount: Math.max(0, g.currentAmount + amount) };
      }
      return g;
    });
    StorageService.saveSavingsGoals(goals);
    return goals;
  },

  // Books
  getBooks: (): Book[] => {
    const raw = safeGet<Book[]>(STORAGE_KEYS.BOOKS, []);
    // Auto-purge old mock book "Чистый код" (142/320)
    return raw.filter((b) => b.id !== "b1");
  },
  saveBooks: (books: Book[]) => safeSet(STORAGE_KEYS.BOOKS, books),
  deleteBook: (id: string): Book[] => {
    const current = StorageService.getBooks();
    const updated = current.filter((b) => b.id !== id);
    StorageService.saveBooks(updated);
    return updated;
  },

  // Complete Reset of Demo Data (clean slate with all counters at zero)
  resetAllDemoData: (): void => {
    const profile = StorageService.getProfile();
    const cleanGoals: SavingsGoal[] = [
      {
        id: "sg_main",
        title: profile.savingsTargetName || "Пассат Б6",
        icon: "car",
        targetAmount: profile.savingsTargetAmount || 700000,
        currentAmount: 0,
        currency: "₽",
        color: "amber",
      },
    ];
    StorageService.saveSavingsGoals(cleanGoals);
    StorageService.saveBooks([]);
    StorageService.savePrintModels([]);
    StorageService.saveCheckpoints([]);
    StorageService.saveEnglishWords([]);
    StorageService.saveWater(0);
    StorageService.saveWorkTasks([]);
    StorageService.saveTradeProducts([]);
    StorageService.saveTradeSales([]);
  },

  // Trade Products & Sales (Товарка & Бизнес)
  getTradeProducts: (): TradeProduct[] => safeGet(STORAGE_KEYS.TRADE_PRODUCTS, []),
  saveTradeProducts: (products: TradeProduct[]) => safeSet(STORAGE_KEYS.TRADE_PRODUCTS, products),
  addTradeProduct: (product: TradeProduct): TradeProduct[] => {
    const current = StorageService.getTradeProducts();
    const updated = [product, ...current];
    StorageService.saveTradeProducts(updated);
    return updated;
  },
  deleteTradeProduct: (id: string): TradeProduct[] => {
    const current = StorageService.getTradeProducts();
    const updated = current.filter((p) => p.id !== id);
    StorageService.saveTradeProducts(updated);
    return updated;
  },

  getTradeSales: (): TradeSale[] => safeGet(STORAGE_KEYS.TRADE_SALES, []),
  saveTradeSales: (sales: TradeSale[]) => safeSet(STORAGE_KEYS.TRADE_SALES, sales),
  addTradeSale: (sale: TradeSale): { sales: TradeSale[]; products: TradeProduct[] } => {
    const sales = [sale, ...StorageService.getTradeSales()];
    StorageService.saveTradeSales(sales);

    // Deduct quantity from product stock
    const products = StorageService.getTradeProducts().map((p) => {
      if (p.id === sale.productId) {
        return {
          ...p,
          stockQuantity: Math.max(0, p.stockQuantity - sale.quantity),
        };
      }
      return p;
    });
    StorageService.saveTradeProducts(products);

    return { sales, products };
  },
  deleteTradeSale: (id: string): TradeSale[] => {
    const current = StorageService.getTradeSales();
    const target = current.find((s) => s.id === id);
    const updated = current.filter((s) => s.id !== id);
    StorageService.saveTradeSales(updated);

    // Restore stock if sale was cancelled
    if (target) {
      const products = StorageService.getTradeProducts().map((p) => {
        if (p.id === target.productId) {
          return { ...p, stockQuantity: p.stockQuantity + target.quantity };
        }
        return p;
      });
      StorageService.saveTradeProducts(products);
    }

    return updated;
  },

  // Work & Study Tasks
  getWorkTasks: (): WorkTask[] => safeGet(STORAGE_KEYS.WORK_TASKS, []),
  saveWorkTasks: (tasks: WorkTask[]) => safeSet(STORAGE_KEYS.WORK_TASKS, tasks),
  addWorkTask: (task: WorkTask): WorkTask[] => {
    const current = StorageService.getWorkTasks();
    const updated = [task, ...current];
    StorageService.saveWorkTasks(updated);
    return updated;
  },
  toggleWorkTask: (id: string): WorkTask[] => {
    const current = StorageService.getWorkTasks();
    const updated = current.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    StorageService.saveWorkTasks(updated);
    return updated;
  },
  deleteWorkTask: (id: string): WorkTask[] => {
    const current = StorageService.getWorkTasks();
    const updated = current.filter((t) => t.id !== id);
    StorageService.saveWorkTasks(updated);
    return updated;
  },

  // English
  getEnglishWords: (): WordItem[] => safeGet(STORAGE_KEYS.ENGLISH_WORDS, []),
  saveEnglishWords: (words: WordItem[]) => safeSet(STORAGE_KEYS.ENGLISH_WORDS, words),
  getEnglishMinutes: (): number => safeGet(STORAGE_KEYS.ENGLISH_MINUTES, 0),
  saveEnglishMinutes: (min: number) => safeSet(STORAGE_KEYS.ENGLISH_MINUTES, min),

  // Habits & Water
  getHabits: (): DailyHabit[] => safeGet(STORAGE_KEYS.HABITS, initialHabits),
  saveHabits: (habits: DailyHabit[]) => safeSet(STORAGE_KEYS.HABITS, habits),
  getWater: (): number => safeGet(STORAGE_KEYS.WATER_ML, 1750),
  saveWater: (ml: number) => safeSet(STORAGE_KEYS.WATER_ML, ml),
};
