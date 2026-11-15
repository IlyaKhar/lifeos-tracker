-- =====================================================
-- ⚡ LifeOS Tracker: Supabase PostgreSQL Schema
-- Запусти этот скрипт в Supabase -> SQL Editor -> Run
-- =====================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Таблица профилей пользователей
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT DEFAULT 'Малой',
  streak_days INT DEFAULT 1,
  water_target_ml INT DEFAULT 2500,
  calories_target INT DEFAULT 2400,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS для profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 3. Таблица динамических модулей пользователя
CREATE TABLE IF NOT EXISTS public.modules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  icon TEXT NOT NULL,
  accent_color TEXT,
  border_color TEXT,
  preview_value TEXT,
  preview_subtext TEXT,
  is_custom BOOLEAN DEFAULT false,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own modules" ON public.modules FOR ALL USING (auth.uid() = user_id);

-- 4. Зал: Вес тела
CREATE TABLE IF NOT EXISTS public.weight_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg NUMERIC(5,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, date)
);

ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own weight logs" ON public.weight_logs FOR ALL USING (auth.uid() = user_id);

-- 5. Зал: Тренировочные сессии
CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  name TEXT NOT NULL,
  duration_minutes INT DEFAULT 60,
  notes TEXT,
  exercises JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own workouts" ON public.workouts FOR ALL USING (auth.uid() = user_id);

-- 6. 3D-Печать: Катушки филамента
CREATE TABLE IF NOT EXISTS public.filament_spools (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  brand TEXT NOT NULL,
  material TEXT NOT NULL,
  color_name TEXT NOT NULL,
  color_hex TEXT NOT NULL,
  total_weight_grams INT DEFAULT 1000,
  remaining_weight_grams INT NOT NULL,
  nozzle_temp INT DEFAULT 210,
  bed_temp INT DEFAULT 60,
  price_rub INT DEFAULT 1200,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.filament_spools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own spools" ON public.filament_spools FOR ALL USING (auth.uid() = user_id);

-- 7. 3D-Печать: Очередь и история печати
CREATE TABLE IF NOT EXISTS public.print_jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  spool_id UUID REFERENCES public.filament_spools ON DELETE SET NULL,
  weight_grams INT NOT NULL,
  estimated_duration TEXT,
  cost_rub INT DEFAULT 0,
  status TEXT DEFAULT 'queued', -- queued, printing, completed, failed
  progress_percent INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.print_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own print jobs" ON public.print_jobs FOR ALL USING (auth.uid() = user_id);

-- 8. Накопления: Копилки и финансовые цели
CREATE TABLE IF NOT EXISTS public.savings_goals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  icon TEXT DEFAULT '🎯',
  target_amount NUMERIC(12,2) NOT NULL,
  current_amount NUMERIC(12,2) DEFAULT 0,
  currency TEXT DEFAULT '₽',
  color TEXT DEFAULT 'amber',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own savings" ON public.savings_goals FOR ALL USING (auth.uid() = user_id);

-- 9. Книги
CREATE TABLE IF NOT EXISTS public.books (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  author TEXT,
  total_pages INT NOT NULL,
  current_page INT DEFAULT 0,
  status TEXT DEFAULT 'reading', -- reading, planned, completed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own books" ON public.books FOR ALL USING (auth.uid() = user_id);

-- 10. Ежедневные метрики (Вода, калории)
CREATE TABLE IF NOT EXISTS public.daily_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  water_ml INT DEFAULT 0,
  calories INT DEFAULT 0,
  focus_minutes INT DEFAULT 0,
  notes TEXT,
  UNIQUE(user_id, date)
);

ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own daily logs" ON public.daily_logs FOR ALL USING (auth.uid() = user_id);

-- Автоматическое создание профиля при регистрации через Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (new.id, new.email, split_part(new.email, '@', 1));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
