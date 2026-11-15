"use client";

import React from "react";
import {
  Dumbbell,
  Layers,
  Wallet,
  BookOpen,
  Languages,
  Briefcase,
  Droplets,
  Flame,
  Trophy,
  Target,
  Scale,
  Sparkles,
  Music,
  Car,
  Code2,
  Heart,
  Timer,
  Zap,
  Activity,
  Package,
  ShoppingBag,
  Store,
  TrendingUp,
  LucideIcon,
} from "lucide-react";

interface AppIconProps {
  name: string;
  className?: string;
  size?: number;
  containerClassName?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  // Gym & Body
  gym: Dumbbell,
  dumbbell: Dumbbell,
  "🏋️": Dumbbell,
  scale: Scale,
  "⚖️": Scale,
  activity: Activity,
  heart: Heart,

  // 3D Printing
  "3d": Layers,
  layers: Layers,
  printer: Layers,
  "🖨️": Layers,

  // Savings
  savings: Wallet,
  wallet: Wallet,
  "💰": Wallet,
  target: Target,
  "🎯": Target,

  // Languages / English
  english: Languages,
  languages: Languages,
  globe: Languages,
  "🇬🇧": Languages,

  // Reading / Books
  reading: BookOpen,
  books: BookOpen,
  book: BookOpen,
  "📚": BookOpen,

  // Work & Productivity
  work: Briefcase,
  briefcase: Briefcase,
  "💼": Briefcase,
  code: Code2,
  "💻": Code2,

  // Trade / Resale / Товарка
  trade: Package,
  package: Package,
  store: Store,
  "shopping-bag": ShoppingBag,
  "trending-up": TrendingUp,
  "📦": Package,
  "🛍️": ShoppingBag,

  // Habits & Extras
  water: Droplets,
  droplets: Droplets,
  "💧": Droplets,
  flame: Flame,
  "🔥": Flame,
  trophy: Trophy,
  "🏆": Trophy,
  sparkles: Sparkles,
  "✨": Sparkles,
  music: Music,
  "🎸": Music,
  car: Car,
  "🚗": Car,
  timer: Timer,
  zap: Zap,
};

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  className = "w-5 h-5",
  size = 20,
  containerClassName,
}) => {
  const IconComponent = ICON_MAP[name.toLowerCase()] || ICON_MAP[name] || Zap;

  if (containerClassName) {
    return (
      <div className={containerClassName}>
        <IconComponent className={className} size={size} strokeWidth={2.2} />
      </div>
    );
  }

  return <IconComponent className={className} size={size} strokeWidth={2.2} />;
};

