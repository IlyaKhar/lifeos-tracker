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
  SAVINGS: "lifeos_savings_v1",
  BOOKS: "lifeos_books_v1",
  HABITS: "lifeos_habits_v1",
  WATER_ML: "lifeos_water_ml_v1",
  ENGLISH_WORDS: "lifeos_english_words_v1",
  ENGLISH_MINUTES: "lifeos_english_min_v1",
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
      const updatedGoals = [
        {
          id: "sg_main",
          title: profile.savingsTargetName,
          icon: "car",
          targetAmount: profile.savingsTargetAmount,
          currentAmount: 0,
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

  // Modules
  getModules: (): ModuleItem[] => safeGet(STORAGE_KEYS.MODULES, initialModules),
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

    const modules = StorageService.getModules();
    const gymIdx = modules.findIndex((m) => m.id === "gym");
    if (gymIdx !== -1) {
      modules[gymIdx].previewValue = `${weightKg} кг`;
      StorageService.saveModules(modules);
    }
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

  // 3D Spools & Jobs
  getSpools: (): FilamentSpool[] => safeGet(STORAGE_KEYS.SPOOLS, initialSpools),
  saveSpools: (spools: FilamentSpool[]) => safeSet(STORAGE_KEYS.SPOOLS, spools),
  deleteSpool: (id: string): FilamentSpool[] => {
    const current = StorageService.getSpools();
    const updated = current.filter((s) => s.id !== id);
    StorageService.saveSpools(updated);
    return updated;
  },
  getPrintJobs: (): PrintJob[] => safeGet(STORAGE_KEYS.PRINT_JOBS, initialPrintJobs),
  savePrintJobs: (jobs: PrintJob[]) => safeSet(STORAGE_KEYS.PRINT_JOBS, jobs),
  deletePrintJob: (id: string): PrintJob[] => {
    const current = StorageService.getPrintJobs();
    const updated = current.filter((j) => j.id !== id);
    StorageService.savePrintJobs(updated);
    return updated;
  },

  // Savings
  getSavingsGoals: (): SavingsGoal[] => safeGet(STORAGE_KEYS.SAVINGS, initialSavingsGoals),
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

    const modules = StorageService.getModules();
    const savIdx = modules.findIndex((m) => m.id === "savings");
    if (savIdx !== -1) {
      const g = goals.find((x) => x.id === goalId);
      if (g) {
        modules[savIdx].previewValue = `${g.currentAmount.toLocaleString("ru-RU")} ₽`;
        modules[savIdx].previewSubtext = `${g.title} (${Math.round((g.currentAmount / g.targetAmount) * 100)}%)`;
      }
      StorageService.saveModules(modules);
    }
    return goals;
  },

  // Books
  getBooks: (): Book[] => safeGet(STORAGE_KEYS.BOOKS, []),
  saveBooks: (books: Book[]) => {
    safeSet(STORAGE_KEYS.BOOKS, books);
    const modules = StorageService.getModules();
    const bIdx = modules.findIndex((m) => m.id === "reading");
    if (bIdx !== -1) {
      const active = books.find((b) => b.status === "reading");
      if (active) {
        modules[bIdx].previewValue = `${active.currentPage} / ${active.totalPages}`;
        modules[bIdx].previewSubtext = `${active.title} (${Math.round((active.currentPage / active.totalPages) * 100)}%)`;
      } else {
        modules[bIdx].previewValue = "0 книг";
        modules[bIdx].previewSubtext = "Добавь книгу";
      }
      StorageService.saveModules(modules);
    }
  },
  deleteBook: (id: string): Book[] => {
    const current = StorageService.getBooks();
    const updated = current.filter((b) => b.id !== id);
    StorageService.saveBooks(updated);
    return updated;
  },

  // English
  getEnglishWords: (): WordItem[] => safeGet(STORAGE_KEYS.ENGLISH_WORDS, []),
  saveEnglishWords: (words: WordItem[]) => {
    safeSet(STORAGE_KEYS.ENGLISH_WORDS, words);
    const modules = StorageService.getModules();
    const eIdx = modules.findIndex((m) => m.id === "english");
    if (eIdx !== -1) {
      modules[eIdx].previewValue = `${words.length} слов`;
      StorageService.saveModules(modules);
    }
  },
  getEnglishMinutes: (): number => safeGet(STORAGE_KEYS.ENGLISH_MINUTES, 0),
  saveEnglishMinutes: (min: number) => safeSet(STORAGE_KEYS.ENGLISH_MINUTES, min),

  // Habits & Water
  getHabits: (): DailyHabit[] => safeGet(STORAGE_KEYS.HABITS, initialHabits),
  saveHabits: (habits: DailyHabit[]) => safeSet(STORAGE_KEYS.HABITS, habits),
  getWater: (): number => safeGet(STORAGE_KEYS.WATER_ML, 1750),
  saveWater: (ml: number) => safeSet(STORAGE_KEYS.WATER_ML, ml),
};
