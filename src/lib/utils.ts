import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Semester Normalization ───
// Converts ANY legacy format to standard "year-sem" (e.g. "3-2")
// Handles: "S4", "S6", 4, 6, "4", "3-2" (passthrough)
const SEMESTER_MAP: Record<number, string> = {
  1: "1-1", 2: "1-2",
  3: "2-1", 4: "2-2",
  5: "3-1", 6: "3-2",
  7: "4-1", 8: "4-2",
};

export const normalizeSemester = (sem: string | number | undefined | null): string => {
  if (!sem) return "";
  const str = String(sem).trim();

  // Already correct format
  if (/^[1-4]-[1-2]$/.test(str)) return str;

  // Parse numeric from "S4", "S6", "4", "6", etc.
  const num = parseInt(str.replace(/\D/g, ""), 10);
  if (!num || isNaN(num) || num < 1 || num > 8) return str; // fallback

  return SEMESTER_MAP[num] || str;
};

// Backward-compatible alias
export const getDisplaySemester = normalizeSemester;

