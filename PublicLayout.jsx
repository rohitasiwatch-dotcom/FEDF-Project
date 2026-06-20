// React Concept: Outlet renders the child routes of the layout.
// React Router: Link is used for navigation, and useNavigate is a hook for programmatic routing.
import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

// Custom context hooks to access shared global states
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { Shield, Sun, Moon } from "lucide-react";

// React Concept: PublicLayout acts as a wrapper/parent component with shared layout structure
export default function PublicLayout() {
  // Custom Hooks: Consuming theme and authentication context variables/functions
  const { darkMode, toggleDarkMode, t } = useTheme();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? "dark bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-800"}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
              VaxShield
            </span>
          </div>

          <div className="flex items-center gap-4">

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* CTA / Account */}
            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link
                  to={currentUser.role === "admin" ? "/admin" : "/dashboard"}
                  className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all"
                >
                  {t("dashboard")}
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-semibold border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  {t("logout")}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">VaxShield</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
              Smarter record-keeping, intelligent recommendations, and verifiable health status credentials. Designed for modern patient-centric vaccine health tracking.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#faq" className="hover:underline">FAQs</a></li>
              <li><a href="#features" className="hover:underline">Features</a></li>
              <li><Link to="/verify" className="hover:underline">Verify Certificate</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">Privacy & Terms</h3>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Terms of Service</a></li>
              <li><a href="#" className="hover:underline">Contact Support</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} VaxShield. All rights reserved. (Frontend Simulation Mode)</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <span>PWA Ready</span>
            <span>•</span>
            <span>HIPAA Compliant UI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
