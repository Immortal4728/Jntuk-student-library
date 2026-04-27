# JNTUK Student Library - Project Details

## 1. Development Workflows
- **Local Development**: The project utilizes Vite for a fast local development server with Hot Module Replacement (HMR). You can spin up the environment using `npm run dev`.
- **Code Linting and Formatting**: ESLint is heavily integrated to ensure code quality and statically catch problematic patterns (`npm run lint`).
- **Feature Addition Structure**: The project codebase follows a modular React component-based engineering workflow:
  - Reusable UI elements are maintained in `src/components/`.
  - Route views live in `src/pages/`.
  - Business logic, specifically the authentication and database sync logic, is safely abstracted inside `src/context/` (e.g., `AuthContext.tsx`).
- **State Management & Data Synchronization**: 
  - The Context API (`AuthContext`) manages all global user authentication states and caches current session profiles.
  - Application changes asynchronously push/pull to Firebase Firestore.

## 2. CI/CD Pipelines & Deployment Base
- **Frontend Hosting (Vercel)**: The primary deployment environment is Vercel. A dedicated `vercel.json` regulates rewrites seamlessly to support the Single Page Application (SPA) structure along with strict security headers (e.g., `X-Frame-Options`, `Referrer-Policy`).
- **Build Operations**: Production environments leverage the `npm run build` script. This handles strict TypeScript diagnostics (`tsc -b`) followed seamlessly by the Vite bundling engine (`vite build`) directly outputting to the `dist` directory.
- **Automatic Deployment Integration**: Any push updates to the connected remote branch inherently trigger the Vercel builder pipeline which auto-compiles and shifts the newly bundled artifacts over to the live CDN.

## 3. Languages Used
- **TypeScript (TS/TSX)**: Used as the primary scripting language ensuring static typing, deterministic data models, and scalable architectures.
- **HTML5**: Core foundational markup structuring logic.
- **CSS3 / Tailwind PostCSS Pipeline**: Used natively with Tailwind framework configurations to output concise, dynamic stylistic utilities.

## 4. Tech Stack Breakdown
- **Frontend Core Framework**: React 19.
- **Development Tooling/Bundler**: Vite 7.
- **Routing**: React Router DOM v7 (Provides comprehensive nested routes and SPA page structures).
- **Styling Solutions**: Tailwind CSS v3.4.15 combined natively with generic UI utility kits like `clsx` and `tailwind-merge` for streamlined dynamic class variants.
- **UI Animation Modules**: GSAP (GreenSock Animation Platform) and Framer Motion handles comprehensive screen transition experiences, micro-animations, and cinematic layouts.
- **Backend as a Service (BaaS)**: 
  - **Authentication**: Managed via `firebase/auth` and covers standard account lifecycle actions.
  - **Database System**: Firebase Firestore provides a NoSQL real-time document paradigm for instantaneous user profile updates, indexing, and material documentation syncs.
- **Miscellaneous Dependencies**: Native document conversions and capture integrations powered by `html2canvas` and `jspdf`. Graphic iconography comes straight via `lucide-react`.

## 5. System Roles & Capabilities

### A. Administrator Role
- **Recognition**: An administrative account is flagged dynamically when the `AuthContext` authenticates the root email (`rishichowdary2099@gmail.com`). 
- **Capabilities**:
  - Bypasses traditional limits giving complete visibility into the overarching `AdminDashboardPage.tsx`.
  - Capable of managing user arrays and system statistics.
  - Can broadly oversee, modify, and update standard academic configurations and directly interact with cloud resource buckets seamlessly.
  - Full read/write backend administration over Firebase records relative to library modifications and material management arrays.

### B. Student (User) Role
- **Recognition**: Any standard unified account utilizing Firebase Authentication. The localized `AuthContext` will naturally scaffold a `UserProfile` schema mapping academic specifics (College, Branch, Semester, Backlogs).
- **Capabilities**:
  - General access to the standard `DashboardPage.tsx` interface suite.
  - Allowed view-level rights to actively browse, search, and download student materials customized around their targeted branch and current lifecycle semester (`MaterialsPage.tsx`).
  - Open tools natively access the embedded Academic Tracker platform (`AcademicTrackerPage.tsx`, `ResultsHubPage.tsx`) specifically to compute CGPA variables, measure performance arrays dynamically, or predict potential grade trajectories.
  - Has the right to bookmark/save specific study resources locally under their explicit document id for later retrieval (`SavedMaterialsPage.tsx`).
  - Read/Write privileges restricted specifically towards configuring, mutating, and updating individual account data. User details dynamically sync against their explicitly tied Firestore instance.
