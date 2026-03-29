import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getDisplaySemester } from "../lib/utils";
import {
  Search,
  BookOpen,
  Download,
  ChevronDown,
  ChevronUp,
  Star,
  FileText,
} from "lucide-react";
import { Button } from "../components/ui/button";

// --- Types ---
type SubjectUnits = {
  unit1?: string;
  unit2?: string;
  unit3?: string;
  unit4?: string;
  unit5?: string;
  important?: string;
};

type Subject = {
  id: string;
  name: string;
  branch: string;
  semester: string;
  units: SubjectUnits;
};

// --- Dictionary Data ---
const subjectsData: Record<string, Record<string, string[]>> = {
  CSE: {
    "2-1": ["Universal Human Values", "Discrete Mathematics", "Digital Logic", "Data Structures", "OOPs with Java"],
    "2-2": ["MEFA", "Probability & Statistics", "DBMS", "Operating Systems", "Software Engineering"],
    "3-1": ["Data Warehousing", "Formal Languages", "Computer Networks", "Artificial Intelligence", "EDVC"],
    "3-2": ["Compiler Design", "Cloud Computing", "Network Security", "Machine Learning", "Software Project Mgmt", "MPMC"]
  },
  IT: {
    "2-1": ["Discrete Mathematics", "Universal Human Values", "Digital Logic", "Data Structures", "Java"],
    "2-2": ["Optimization", "Probability & Statistics", "Operating Systems", "DBMS", "Software Engineering"],
    "3-1": ["Advanced Java", "Computer Networks", "Compiler Design", "Data Warehousing", "Electronics"],
    "3-2": ["Machine Learning", "Software Methodology", "Software Project Mgmt", "Network Security", "Cloud Computing", "MPMC"]
  },
  ECE: {
    "2-1": ["Probability & Stochastic", "Universal Human Values", "Signals & Systems", "Electronic Devices", "Logic Design"],
    "2-2": ["MEFA", "Control Systems", "Electromagnetic Waves", "Circuit Analysis", "Analog Communication"],
    "3-1": ["IC Applications", "Digital Communications", "Antennas & Propagation", "Measurements", "Computer Architecture"],
    "3-2": ["VLSI Design", "Digital Signal Processing", "Machine Learning", "Microcontrollers", "Embedded Systems", "DBMS"]
  },
  AIML: {}
};

const commonFirstYear: Record<string, string[]> = {
  "1-1": [
    "Communicative English",
    "Engineering Chemistry",
    "Linear Algebra & Calculus",
    "Basic Civil & Mechanical Engineering",
    "Introduction to Programming (C)"
  ],
  "1-2": [
    "Engineering Physics",
    "Differential Equations & Vector Calculus",
    "Basic Electrical and Engineering",
    "Engineering Graphics",
    "Data Structures"
  ]
};

export default function DashboardMaterialsPage() {
  const { profile } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);

  useEffect(() => {
    if (!profile) return;
    
    // Clear state before hydrating new ones to guarantee reactivity feel
    setSubjects([]);

    const fetchMaterials = (branch: string, semester: string) => {
      const currentSemLabel = getDisplaySemester(semester || '1-1');

      let data: string[] = [];
      if (currentSemLabel.startsWith('1-')) {
        data = commonFirstYear[currentSemLabel] || [];
      } else {
        data = subjectsData[branch]?.[currentSemLabel] || [];
      }

      const mapped: Subject[] = data.map((name) => ({
        id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name,
        branch,
        semester,
        units: {
          // Mock units to populate visually, just as requested
          unit1: "link_to_file",
          unit2: "link_to_file",
          unit3: "link_to_file",
          important: "link_to_file"
        }
      }));

      setSubjects(mapped);
    };

    fetchMaterials(profile.branch, profile.semester);
  }, [profile?.branch, profile?.semester]); // specifically trace branch and semester hooks

  const unitSlots = [
    { key: "unit1", label: "Unit 1" },
    { key: "unit2", label: "Unit 2" },
    { key: "unit3", label: "Unit 3" },
    { key: "unit4", label: "Unit 4" },
    { key: "unit5", label: "Unit 5" },
    { key: "important", label: "Important Questions" },
  ];

  const toggleSubject = (id: string) => {
    setExpandedSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <header>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
          Materials
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          {profile?.branch} • {getDisplaySemester(profile?.semester || "")} Sem — Browse and download your study materials.
        </p>
      </header>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search subjects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all text-sm shadow-sm"
        />
      </div>

      {/* Subject Count */}
      <div className="flex items-center justify-between px-0.5">
        <h3 className="font-semibold text-slate-700 flex items-center gap-2 text-sm">
          <BookOpen className="w-4 h-4" />
          Subjects
        </h3>
        <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
          {filteredSubjects.length} found
        </span>
      </div>

      {/* Subjects List */}
      <div className="space-y-3">
        {filteredSubjects.map((subject) => {
          const isExpanded = expandedSubjects.includes(subject.id);
          const availableUnits = unitSlots.filter(
            ({ key }) => subject.units[key as keyof SubjectUnits]
          );

          return (
            <div
              key={subject.id}
              className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all duration-200 ${
                isExpanded
                  ? "border-slate-300 shadow-md"
                  : "border-slate-200 hover:shadow-md hover:border-slate-300"
              }`}
            >
              {/* Subject Header — Expandable */}
              <button
                onClick={() => toggleSubject(subject.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors text-left"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isExpanded 
                      ? "bg-slate-900 text-white" 
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-slate-900 md:text-[15px] truncate">
                      {subject.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {availableUnits.length} resource{availableUnits.length !== 1 ? "s" : ""} available
                    </p>
                  </div>
                </div>
                <div
                  className={`p-1.5 rounded-lg transition-all ${
                    isExpanded
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Units — Expandable Content */}
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                  isExpanded
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-4 pb-4 pt-0 border-t border-slate-100 bg-slate-50/60">
                    <div className="divide-y divide-slate-100/80">
                      {unitSlots.map(({ key, label }) => {
                        const url = subject.units[key as keyof SubjectUnits];
                        if (!url) return null;
                        const isImportant = key === "important";
                        return (
                          <div
                            key={key}
                            className={`flex items-center justify-between py-3 gap-3 group ${
                              isImportant ? "pt-4" : ""
                            }`}
                          >
                            <span
                              className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${
                                isImportant
                                  ? "text-amber-700 font-semibold"
                                  : "text-slate-700 group-hover:text-slate-900"
                              }`}
                            >
                              {isImportant && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
                              {label}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className={`shrink-0 shadow-sm h-8 text-xs font-semibold transition-colors ${
                                isImportant
                                  ? "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-700 hover:text-white hover:border-amber-700"
                                  : "bg-white hover:bg-slate-900 hover:text-white hover:border-slate-900"
                              }`}
                            >
                              <Download className="w-3.5 h-3.5 mr-1.5" />
                              Download
                            </Button>
                          </div>
                        );
                      })}
                      {Object.keys(subject.units || {}).length === 0 && (
                        <p className="text-sm text-slate-500 py-4 text-center font-medium">
                          No materials available yet.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredSubjects.length === 0 && (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-500">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="font-medium">No subjects found.</p>
            <p className="text-xs mt-1 text-slate-400">
              Your specific branch/semester might not have materials uploaded yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
