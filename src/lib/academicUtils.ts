// ─── Academic Tracker: Grade System & Calculation Utilities ───

export const GRADE_POINTS: Record<string, number> = {
  S: 10,
  A: 9,
  B: 8,
  C: 7,
  D: 6,
  E: 5,
  F: 0,
};

export const GRADE_OPTIONS = Object.keys(GRADE_POINTS); // ['S','A','B','C','D','E','F']

export interface Subject {
  id: string;
  name: string;
  grade: string;
  credits: number;
}

export interface Semester {
  semId: string;
  subjects: Subject[];
}

export type AcademicData = {
  semesters: Semester[];
};

// Generate a short unique ID
export const uid = (): string =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// ─── SGPA for a single semester ───
export function calcSGPA(subjects: Subject[]): number {
  if (!subjects || subjects.length === 0) return 0;
  let totalCredits = 0;
  let weightedSum = 0;

  for (const sub of subjects) {
    const gp = GRADE_POINTS[sub.grade];
    if (gp === undefined) continue;
    weightedSum += gp * sub.credits;
    totalCredits += sub.credits;
  }

  if (totalCredits === 0) return 0;
  return parseFloat((weightedSum / totalCredits).toFixed(2));
}

// ─── Total credits for a semester ───
export function totalCredits(subjects: Subject[]): number {
  return subjects.reduce((sum, s) => sum + s.credits, 0);
}

// ─── Backlog count for a semester ───
export function backlogCount(subjects: Subject[]): number {
  return subjects.filter((s) => s.grade === "F").length;
}

// ─── CGPA: weighted average across all semesters ───
export function calcCGPA(semesters: Semester[]): number {
  if (!semesters || semesters.length === 0) return 0;

  let totalCredits = 0;
  let weightedSum = 0;

  for (const sem of semesters) {
    for (const sub of sem.subjects) {
      const gp = GRADE_POINTS[sub.grade];
      if (gp === undefined) continue;
      weightedSum += gp * sub.credits;
      totalCredits += sub.credits;
    }
  }

  if (totalCredits === 0) return 0;
  return parseFloat((weightedSum / totalCredits).toFixed(2));
}

// ─── Percentage from CGPA ───
export function cgpaToPercentage(cgpa: number): number {
  if (cgpa <= 0) return 0;
  return parseFloat(((cgpa - 0.75) * 10).toFixed(1));
}

// ─── Class from CGPA ───
export function getClass(cgpa: number): string {
  if (cgpa >= 9.5) return "Distinction ★";
  if (cgpa >= 8.5) return "Distinction";
  if (cgpa >= 7.5) return "First Class";
  if (cgpa >= 6.5) return "Second Class";
  if (cgpa >= 5.5) return "Third Class";
  if (cgpa > 0) return "Pass";
  return "—";
}

// ─── Total backlogs across all semesters ───
export function totalBacklogs(semesters: Semester[]): number {
  return semesters.reduce((sum, sem) => sum + backlogCount(sem.subjects), 0);
}

// ─── Max SGPA among semesters ───
export function maxSGPA(semesters: Semester[]): number {
  if (!semesters.length) return 0;
  return Math.max(...semesters.map((s) => calcSGPA(s.subjects)));
}

// ─── Total credits across all semesters ───
export function totalCreditsAll(semesters: Semester[]): number {
  return semesters.reduce(
    (sum, sem) => sum + totalCredits(sem.subjects),
    0
  );
}

// ─── Grade color mapping ───
export function gradeColor(grade: string): { bg: string; text: string } {
  switch (grade) {
    case "S": return { bg: "bg-emerald-100", text: "text-emerald-700" };
    case "A": return { bg: "bg-blue-100", text: "text-blue-700" };
    case "B": return { bg: "bg-cyan-100", text: "text-cyan-700" };
    case "C": return { bg: "bg-amber-100", text: "text-amber-700" };
    case "D": return { bg: "bg-orange-100", text: "text-orange-700" };
    case "E": return { bg: "bg-purple-100", text: "text-purple-700" };
    case "F": return { bg: "bg-red-100", text: "text-red-700" };
    default: return { bg: "bg-slate-100", text: "text-slate-600" };
  }
}

// ─── Default semester IDs in order ───
export const ALL_SEMESTER_IDS = [
  "1-1", "1-2", "2-1", "2-2", "3-1", "3-2", "4-1", "4-2",
];

// ─── Default empty semester ───
export function createEmptySemester(semId: string): Semester {
  return { semId, subjects: [] };
}

// ─── Default subject ───
export function createDefaultSubject(): Subject {
  return {
    id: uid(),
    name: "",
    grade: "S",
    credits: 3,
  };
}
