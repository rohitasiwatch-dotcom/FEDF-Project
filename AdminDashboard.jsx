// React Hook: useState is a React Hook that lets you add local state variables to your component.
import React, { useState } from "react";
// React Router: Link handles navigation between admin panels
import { Link } from "react-router-dom";
// Context subscription hooks
import { useAuth } from "../context/AuthContext";
import { useVaccine } from "../context/VaccineContext";
import { useNotification } from "../context/NotificationContext";
import {
  Users,
  ShieldCheck,
  FileSearch,
  Award,
  Megaphone,
  CheckCircle,
  XCircle,
  FileText,
  AlertOctagon
} from "lucide-react";
import { toast } from "react-toastify";

// React Concept: AdminDashboard represents the administrative control center allowing broadcasts and quick access to verifications
export default function AdminDashboard() {
  // Global context retrievals
  const { users } = useAuth();
  const { records, approveRecord, rejectRecord } = useVaccine();
  const { addNotification } = useNotification();

  // useState: state variables for broadcasting announcement input parameters
  const [annTitle, setAnnTitle] = useState("");
  const [annMessage, setAnnMessage] = useState("");

  const patientUsers = users.filter((u) => u.role === "user");
  const pendingRecords = records.filter((r) => r.verifiedStatus === "pending");
  const approvedRecords = records.filter((r) => r.verifiedStatus === "approved");

  const handlePublishAnnouncement = (e) => {
    e.preventDefault();
    if (!annTitle.trim() || !annMessage.trim()) {
      toast.error("Please enter a title and message.");
      return;
    }

    addNotification({
      userId: "all",
      type: "announcement",
      title: `Admin Announcement: ${annTitle.trim()}`,
      message: annMessage.trim()
    });

    setAnnTitle("");
    setAnnMessage("");
    toast.success("Broadcast announcement sent to all users!");
  };

  const statCards = [
    { label: "Active Patients", value: patientUsers.length, icon: Users, color: "text-blue-500", link: "/admin/users" },
    { label: "Immunizations Logged", value: records.length, icon: FileText, color: "text-indigo-500", link: "/admin/verification" },
    { label: "Pending Verifications", value: pendingRecords.length, icon: AlertOctagon, color: "text-amber-500", link: "/admin/verification" },
    { label: "Active Certificates", value: approvedRecords.length, icon: Award, color: "text-emerald-500", link: "/admin/analytics" }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h2 className="text-xl font-bold dark:text-white">Admin Dashboard</h2>
        <p className="text-xs text-slate-400">Oversee pending approvals, patients logs, and distribute advisory alerts.</p>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <Link
              key={idx}
              to={c.link}
              className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition duration-200 flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{c.label}</span>
                <span className="text-2xl font-extrabold tracking-tight dark:text-white block mt-1">{c.value}</span>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center ${c.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Lower Dashboard panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Announcement Broadcaster & Verification Checklist */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Announcement Builder */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2">
              <Megaphone className="w-5 h-5 text-blue-500 animate-bounce" />
              Broadcast Announcement Bulletin
            </h3>
            
            <form onSubmit={handlePublishAnnouncement} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Advisory Title</label>
                <input
                  type="text"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="e.g. Updated Booster Regulations, Holiday center times..."
                  className="w-full px-4 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-xl focus:outline-none dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1">Broadcasting Content</label>
                <textarea
                  value={annMessage}
                  onChange={(e) => setAnnMessage(e.target.value)}
                  rows="3"
                  placeholder="Details to alert standard patient feeds..."
                  className="w-full px-4 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-xl focus:outline-none dark:text-white"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow transition"
                >
                  Send Broadcast
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Right Column: Pending Approvals Quick View */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Pending Verification Inbox
            </h3>

            <div className="space-y-3">
              {pendingRecords.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 italic">
                  Verification inbox is empty.
                </div>
              ) : (
                pendingRecords.slice(0, 4).map((rec) => {
                  const patient = users.find((u) => u.id === rec.userId);
                  return (
                    <div
                      key={rec.id}
                      className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800/80 rounded-xl flex items-center justify-between text-xs gap-3"
                    >
                      <div className="overflow-hidden">
                        <span className="font-bold text-slate-805 dark:text-white block truncate">{patient?.name || "Patient"}</span>
                        <span className="text-[10px] text-slate-400 block truncate mt-0.5">{rec.vaccineName}</span>
                      </div>
                      <Link
                        to="/admin/verification"
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded shadow transition shrink-0"
                      >
                        Inspect
                      </Link>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <Link
            to="/admin/verification"
            className="mt-6 text-center text-xs font-bold text-blue-600 dark:text-sky-400 border border-slate-100 dark:border-slate-800 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 transition"
          >
            Open Verification Console
          </Link>
        </div>

      </div>
    </div>
  );
}
