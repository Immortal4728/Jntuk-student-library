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

// ─── SGPA for a single semester (full precision; round only in UI) ───
export function calcSGPA(subjects: Subject[]): number {
  if (!subjects || subjects.length === 0) return 0;
  let totalCredits = 0;
  let totalPoints = 0;

  for (const sub of subjects) {
    const gradePoint = GRADE_POINTS[sub.grade];
    if (gradePoint === undefined) continue;
    const credit = Number(sub.credits) || 0;
    totalPoints += gradePoint * credit;
    totalCredits += credit;
  }

  if (totalCredits === 0) return 0;
  return totalPoints / totalCredits;
}

// ─── Total credits for a semester ───
export function totalCredits(subjects: Subject[]): number {
  return subjects.reduce((sum, s) => sum + (Number(s.credits) || 0), 0);
}

// ─── Backlog count for a semester ───
export function backlogCount(subjects: Subject[]): number {
  return subjects.filter((s) => s.grade === "F").length;
}

// ─── CGPA: weighted average across all semesters (full precision; round only in UI) ───
export function calcCGPA(semesters: Semester[]): number {
  if (!semesters || semesters.length === 0) return 0;

  let totalCredits = 0;
  let totalPoints = 0;

  for (const sem of semesters) {
    for (const sub of sem.subjects) {
      const gradePoint = GRADE_POINTS[sub.grade];
      if (gradePoint === undefined) continue;
      const credit = Number(sub.credits) || 0;
      totalPoints += gradePoint * credit;
      totalCredits += credit;
    }
  }

  if (totalCredits === 0) return 0;
  return totalPoints / totalCredits;
}

/** 2-decimal GPA string for display only. */
export function formatGpa(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(2);
}

// ─── Percentage from CGPA (full precision for logic) ───
export function cgpaToPercentage(cgpa: number): number {
  if (cgpa <= 0) return 0;
  return (cgpa - 0.5) * 10;
}

// ─── Class from CGPA ───
export function getClass(cgpa: number): string {
  if (cgpa <= 0) return "—";
  if (cgpa >= 7.5) return "First Class with Distinction";
  else if (cgpa >= 6.5) return "First Class";
  else if (cgpa >= 5.5) return "Second Class";
  else if (cgpa >= 5.0) return "Pass Class";
  else return "Fail";
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
    case "S":
    case "A": return { bg: "bg-emerald-100", text: "text-emerald-700" };
    case "B":
    case "C": return { bg: "bg-blue-100", text: "text-blue-700" };
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
