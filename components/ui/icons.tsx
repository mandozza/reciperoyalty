import {
  Loader2,
  UserPlus,
  UserMinus,
  Camera,
  Heart,
  Clock,
  ChefHat,
  Book,
  Search,
  type LucideIcon,
} from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  spinner: Loader2,
  userPlus: UserPlus,
  userMinus: UserMinus,
  camera: Camera,
  heart: Heart,
  clock: Clock,
  chefHat: ChefHat,
  book: Book,
  search: Search,
} as const;
