import {
  ModuleItem,
  BodyWeightLog,
  WorkoutSession,
  FilamentSpool,
  PrintJob,
  SavingsGoal,
  Book,
  DailyHabit,
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

const STORAGE_KEYS = {
  MODULES: "lifeos_modules_v1",
  WEIGHT_LOGS: "lifeos_weight_logs_v1",
  WORKOUTS: "lifeos_workouts_v1",
  SPOOLS: "lifeos_spools_v1",
  PRINT_JOBS: "lifeos_print_jobs_v1",
  SAVINGS: "lifeos_savings_v1",
  BOOKS: "lifeos_books_v1",
  HABITS: "lifeos_habits_v1",
  WATER_ML: "lifeos_water_ml_v1",
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
  getModules: (): ModuleItem[] => safeGet(STORAGE_KEYS.MODULES, initialModules),
  saveModules: (modules: ModuleItem[]) => safeSet(STORAGE_KEYS.MODULES, modules),

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

    // Also update module preview
    const modules = StorageService.getModules();
    const gymIdx = modules.findIndex((m) => m.id === "gym");
    if (gymIdx !== -1) {
      modules[gymIdx].previewValue = `${weightKg} кг`;
      StorageService.saveModules(modules);
    }
    return updated;
  },

  getWorkouts: (): WorkoutSession[] => safeGet(STORAGE_KEYS.WORKOUTS, initialWorkouts),
  saveWorkouts: (workouts: WorkoutSession[]) => safeSet(STORAGE_KEYS.WORKOUTS, workouts),

  getSpools: (): FilamentSpool[] => safeGet(STORAGE_KEYS.SPOOLS, initialSpools),
  saveSpools: (spools: FilamentSpool[]) => safeSet(STORAGE_KEYS.SPOOLS, spools),

  getPrintJobs: (): PrintJob[] => safeGet(STORAGE_KEYS.PRINT_JOBS, initialPrintJobs),
  savePrintJobs: (jobs: PrintJob[]) => safeSet(STORAGE_KEYS.PRINT_JOBS, jobs),

  getSavingsGoals: (): SavingsGoal[] => safeGet(STORAGE_KEYS.SAVINGS, initialSavingsGoals),
  saveSavingsGoals: (goals: SavingsGoal[]) => safeSet(STORAGE_KEYS.SAVINGS, goals),
  depositSavings: (goalId: string, amount: number): SavingsGoal[] => {
    const goals = StorageService.getSavingsGoals().map((g) => {
      if (g.id === goalId) {
        return { ...g, currentAmount: g.currentAmount + amount };
      }
      return g;
    });
    StorageService.saveSavingsGoals(goals);

    // Update preview
    const modules = StorageService.getModules();
    const savIdx = modules.findIndex((m) => m.id === "savings");
    if (savIdx !== -1) {
      const g = goals.find((x) => x.id === goalId);
      if (g) {
        modules[savIdx].previewValue = `${g.currentAmount.toLocaleString("ru-RU")} ₽`;
      }
      StorageService.saveModules(modules);
    }
    return goals;
  },

  getBooks: (): Book[] => safeGet(STORAGE_KEYS.BOOKS, initialBooks),
  saveBooks: (books: Book[]) => safeSet(STORAGE_KEYS.BOOKS, books),

  getHabits: (): DailyHabit[] => safeGet(STORAGE_KEYS.HABITS, initialHabits),
  saveHabits: (habits: DailyHabit[]) => safeSet(STORAGE_KEYS.HABITS, habits),

  getWater: (): number => safeGet(STORAGE_KEYS.WATER_ML, 1750),
  saveWater: (ml: number) => safeSet(STORAGE_KEYS.WATER_ML, ml),
};
