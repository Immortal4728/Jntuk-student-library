import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";
import { Button } from "../components/ui/button";

export default function AdminDashboardPage() {
  const { user, signOut } = useAuth();

  return (
    <div className="pt-24 px-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button onClick={signOut} variant="outline" className="gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
      
      <div className="p-6 bg-slate-900 text-white rounded-xl border border-slate-800">
        <h2 className="text-xl font-semibold mb-2 text-blue-400">System Admin Control</h2>
        <p className="text-slate-300 mb-4">
          Logged in as <span className="font-mono text-white">{user?.email}</span>.
        </p>
        <p className="text-slate-400">
          This is a protected route only accessible to the admin account.
        </p>
      </div>
    </div>
  );
}
