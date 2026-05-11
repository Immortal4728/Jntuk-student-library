JNTUK Library

A modern academic platform built for JNTUK students to access study materials, calculate SGPA/CGPA, track academic performance, and manage semester progress — all in one place.

✨ Features
📚 Semester-wise study materials
📝 PYQ (Previous Year Questions) library
📊 SGPA & CGPA calculators
📈 Academic analytics dashboard
📌 Backlog tracking
👤 Firebase Authentication
🛡️ Admin dashboard with real-time user management
⚡ Real-time Firestore integration
🎨 Modern animated UI with glassmorphism aesthetics
🚀 Tech Stack
Frontend
React
TypeScript
Vite
Tailwind CSS
Framer Motion
Backend & Database
Firebase Authentication
Cloud Firestore
Deployment
Vercel
📂 Project Structure
src/
│
├── components/
├── pages/
├── layouts/
├── hooks/
├── lib/
├── context/
├── styles/
└── assets/
🔐 Authentication

The project uses Firebase Authentication for:

Google Sign-In
Email/Password Authentication
Secure Admin Login
🛠️ Firebase Setup

Create a .env file in the root directory:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
▶️ Run Locally

Clone the project:

git clone https://github.com/your-username/jntuk-library.git

Navigate to project folder:

cd jntuk-library

Install dependencies:

npm install

Start development server:

npm run dev
🔥 Firestore Rules

Example Firestore rules for authenticated users and admin access:

rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {

      allow read: if request.auth != null &&
        (
          request.auth.uid == userId ||
          request.auth.token.email == "your-admin-email@gmail.com"
        );

      allow write: if request.auth != null &&
        request.auth.uid == userId;
    }
  }
}
📸 Screenshots
Landing Page
Modern monochrome glassmorphism UI
Animated academic analytics cards
Responsive hero section
Admin Dashboard
Real-time user directory
Academic performance insights
SGPA trend visualization
Firebase-powered live updates
🌐 Deployment

Deployed on Vercel.

Build project:

npm run build

Preview production build:

npm run preview
📌 Future Improvements
AI-powered academic recommendations
Material upload system
Notes marketplace
Semester planner
Dark mode
Mobile app support
👨‍💻 Author

Crafted with precision for JNTUK students.

Rishi Chowdary

📄 License

This project is licensed under the MIT License.
