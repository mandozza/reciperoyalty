import {
  User,
  Image,
  Clock,
  Gauge,
  Heart,
  Book,
  Utensils,
  Camera,
  Loader2,
  type LucideIcon,
} from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  user: User,
  image: Image,
  clock: Clock,
  gauge: Gauge,
  heart: Heart,
  book: Book,
  utensils: Utensils,
  camera: Camera,
  spinner: Loader2,
} as const;
