// React Concept: Outlet renders child pages within this shared authentication layout structure.
// React Router: useNavigate is utilized for programmatic redirection.
import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Shield, Home } from "lucide-react";

// Custom hook to consume context variables
import { useTheme } from "../context/ThemeContext";

// React Concept: AuthLayout acts as a wrapper for authentication pages (Login, Register, etc.)
export default function AuthLayout() {
  // Custom Hook: useTheme for subscribing to global dark mode state
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300 ${
      darkMode ? "dark bg-slate-900 text-slate-100" : "bg-gradient-to-tr from-blue-50 via-slate-50 to-emerald-50 text-slate-800"
    }`}>
      {/* Decorative Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

      {/* Floating Home Button */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold text-xs transition shadow-sm"
        >
          <Home className="w-3.5 h-3.5" />
          Back to Home
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Shield className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
          VaxShield
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
          Smart Vaccination Record Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-white/90 dark:bg-slate-800/90 py-8 px-4 shadow-xl border border-slate-100 dark:border-slate-700/50 sm:rounded-2xl sm:px-10 backdrop-blur-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
