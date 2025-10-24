import {
  Trophy,
  MountainSnow,
  Laptop,
  Heart,
  Zap,
  Target,
  TrendingUp,
  Award,
  HelpCircle, // HelpCircle sebagai ikon default
} from "lucide-react";
// 🚀 1. Impor tipe FC dan SVGProps dari React
import { FC, SVGProps } from "react";

interface CategoryDetails {
  displayName: string;
  // 🚀 2. Ubah tipe 'icon' menjadi React Functional Component yang menerima SVG props
  icon: FC<SVGProps<SVGSVGElement>>;
}

// Mapping dari nama backend ke detail frontend
export const categoryMap: Record<string, CategoryDetails> = {
  FUN_RUN: { displayName: "Fun Run", icon: Heart },
  FIVE_K: { displayName: "5K", icon: Zap },
  TEN_K: { displayName: "10K", icon: Target },
  HALF_MARATHON: { displayName: "Half Marathon", icon: TrendingUp },
  MARATHON: { displayName: "Marathon", icon: Award },
  ULTRA_MARATHON: { displayName: "Ultra Marathon", icon: Trophy },
  TRAIL_RUN: { displayName: "Trail Run", icon: MountainSnow },
  VIRTUAL_RUN: { displayName: "Virtual Run", icon: Laptop },
};

export const getCategoryDetails = (backendName: string): CategoryDetails => {
  return (
    categoryMap[backendName] || { displayName: backendName, icon: HelpCircle }
  ); // Fallback icon
};
