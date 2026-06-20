// React Hook: useState is a React Hook that lets you add a state variable to your component.
import React, { useState } from "react";
// React Router: Outlet is a placeholder for child routes; Link handles routing; useNavigate/useLocation are routing hooks.
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";

// Context hooks for global application state
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNotification } from "../context/NotificationContext";
import {
  Shield,
  LayoutDashboard,
  FileText,
  CalendarDays,
  CalendarRange,
  Search,
  UserCheck,
  Sparkles,
  LogOut,
  Bell,
  Menu,
  X,
  Sun,
  Moon,
  WifiOff,
  PlusCircle,
  CheckCircle2,
  Trash2
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// React Concept: DashboardLayout is a container/wrapper component representing the private user dashboard shell.
export default function DashboardLayout() {
  // Context subscription using custom hooks
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleDarkMode, t, isOffline } = useTheme();
  const { getUserNotifications, markAsRead, markAllAsRead, deleteNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  // useState: local state variables to handle UI toggles (sidebar visibility, notification dropdown visibility)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const notifications = getUserNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const userNavigation = [
    { name: t("dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("records"), href: "/records", icon: FileText },
    { name: t("timeline"), href: "/timeline", icon: CalendarDays },
    { name: t("scheduler"), href: "/scheduler", icon: CalendarRange },
    { name: t("search"), href: "/search", icon: Search },
    { name: t("profile"), href: "/profile", icon: UserCheck },
    { name: "Premium Features", href: "/premium", icon: Sparkles }
  ];

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out!");
    navigate("/");
  };

  const getPageTitle = () => {
    const activeNav = userNavigation.find((n) => n.href === location.pathname);
    return activeNav ? activeNav.name : "VaxShield";
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${darkMode ? "dark bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-800"}`}>
      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} theme={darkMode ? "dark" : "light"} />

      {/* Offline Alert Banner */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-rose-600 text-white text-xs font-semibold py-2 px-4 flex items-center justify-center gap-2 shadow-md">
          <WifiOff className="w-4 h-4 animate-pulse" />
          <span>You are currently offline. Using cached data. Your changes will sync automatically once online.</span>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 transform lg:translate-x-0 lg:static lg:h-screen ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
              VaxShield
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* User Mini Card */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-slate-800 flex items-center justify-center text-blue-600 font-bold border border-blue-200 dark:border-slate-700">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                currentUser?.name?.split(" ").map((n) => n[0]).join("")
              )}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-sm truncate text-slate-800 dark:text-slate-100">{currentUser?.name}</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{currentUser?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {userNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-blue-500/10 text-blue-600 dark:text-sky-400 font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-blue-500 dark:text-sky-400" : "text-slate-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          {currentUser?.role === "admin" && (
            <Link
              to="/admin"
              className="flex items-center gap-3 px-4 py-2.5 mb-2 rounded-xl text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all"
            >
              <UserCheck className="w-5 h-5" />
              {t("admin")}
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            {t("logout")}
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className={`flex-1 flex flex-col min-w-0 ${isOffline ? "pt-8" : ""}`}>
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shrink-0 sticky top-0 z-30 shadow-sm">
          {/* Title & Burger Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100 hidden sm:block">
              {getPageTitle()}
            </h1>
          </div>

          {/* Quick Stats / Global Actions */}
          <div className="flex items-center gap-4">
            {/* Quick Add Record (Hidden on Mobile) */}
            <Link
              to="/records"
              state={{ openAddModal: true }}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Log Vaccine
            </Link>

            {/* Notification Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 relative"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white dark:border-slate-950 rounded-full" />
                )}
              </button>

              {notifDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <span className="font-bold text-xs">Notifications ({unreadCount} unread)</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[10px] text-blue-600 dark:text-sky-400 hover:underline font-bold"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400">No notifications yet.</div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-3 text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                              !n.read ? "bg-blue-50/30 dark:bg-blue-900/10" : ""
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1 mb-1">
                              <h5 className="font-semibold text-slate-800 dark:text-slate-200">{n.title}</h5>
                              <div className="flex gap-1">
                                {!n.read && (
                                  <button
                                    onClick={() => markAsRead(n.id)}
                                    className="p-0.5 rounded text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                                    title="Mark as read"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(n.id)}
                                  className="p-0.5 rounded text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                                  title="Delete notification"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {new Date(n.timestamp).toLocaleString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>



            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-500" />}
            </button>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
