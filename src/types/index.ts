export type ModuleCategory = 'gym' | '3d' | 'savings' | 'reading' | 'english' | 'work' | 'custom';

export interface ModuleItem {
  id: string;
  title: string;
  subtitle: string;
  category: ModuleCategory;
  icon: string;
  accentColor: string;
  borderColor: string;
  previewValue: string;
  previewSubtext: string;
  isCustom?: boolean;
}

// USER PROFILE & ONBOARDING
export type FitnessGoal = 'lose_weight' | 'build_muscle' | 'strength' | 'keep_fit';

export interface UserProfile {
  name: string;
  age: number;
  currentWeight: number;
  targetWeight: number;
  fitnessGoal: FitnessGoal;
  focusCategories: ModuleCategory[];
  savingsTargetName: string;
  savingsTargetAmount: number;
  isOnboarded: boolean;
  createdAt: string;
}

// SMART CHECKPOINTS / ROADMAP
export interface Checkpoint {
  id: string;
  category: ModuleCategory;
  title: string;
  description: string;
  badge: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  completed: boolean;
  createdAt: string;
}

// GYM
export interface ExerciseSet {
  id: string;
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
  rpe?: number;
}

export interface Exercise {
  id: string;
  name: string;
  targetSets: number;
  sets: ExerciseSet[];
  isPR?: boolean;
}

export interface WorkoutSession {
  id: string;
  date: string;
  name: string;
  exercises: Exercise[];
  notes?: string;
  durationMinutes?: number;
}

export interface BodyWeightLog {
  id: string;
  date: string;
  weightKg: number;
  notes?: string;
}

// 3D PRINTING
export interface FilamentSpool {
  id: string;
  brand: string;
  material: 'PLA' | 'PETG' | 'ABS' | 'TPU' | 'ASA' | 'Nylon' | 'Other';
  colorName: string;
  colorHex: string;
  totalWeightGrams: number;
  remainingWeightGrams: number;
  nozzleTemp?: number;
  bedTemp?: number;
  priceRub?: number;
}

export interface PrintJob {
  id: string;
  title: string;
  spoolId: string;
  weightGrams: number;
  estimatedDuration: string;
  costRub: number;
  status: 'queued' | 'printing' | 'completed' | 'failed';
  progressPercent: number;
  dateAdded: string;
}

// SAVINGS
export interface SavingsGoal {
  id: string;
  title: string;
  icon: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  color: string;
  deadlineDate?: string;
}

// BOOKS
export interface Book {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  status: 'reading' | 'planned' | 'completed';
  coverUrl?: string;
}

// ENGLISH
export interface EnglishSession {
  id: string;
  date: string;
  minutesSpent: number;
  category: 'listening' | 'speaking' | 'grammar' | 'reading' | 'vocabulary';
  newWordsLearned: number;
}

// HABITS & TODAY
export interface DailyHabit {
  id: string;
  title: string;
  icon: string;
  completed: boolean;
  streakDays: number;
}

export interface DailyMetrics {
  waterMl: number;
  targetWaterMl: number;
  calories: number;
  targetCalories: number;
  proteinGrams: number;
  focusMinutes: number;
}
