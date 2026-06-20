// React Router: Link handles navigation between dashboard pages.
import React from "react";
import { Link } from "react-router-dom";

// Context subscription hooks to retrieve shared states
import { useAuth } from "../context/AuthContext";
import { useVaccine } from "../context/VaccineContext";
import { useTheme } from "../context/ThemeContext";
import { useNotification } from "../context/NotificationContext";
import {
  FileCheck2,
  CalendarClock,
  AlertOctagon,
  Award,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Clock,
  FileCheck,
  Bell
} from "lucide-react";

// React Concept: UserDashboard displays personal health profile, stats, recent notifications, and quick action logs.
export default function UserDashboard() {
  // Global contexts retrieval
  const { currentUser } = useAuth();
  const { records, schedules } = useVaccine();
  const { t } = useTheme();
  const { getUserNotifications } = useNotification();

  const userRecords = records.filter((r) => r.userId === currentUser?.id);
  const approvedRecords = userRecords.filter((r) => r.verifiedStatus === "approved");
  const pendingRecords = userRecords.filter((r) => r.verifiedStatus === "pending");

  const userSchedules = schedules.filter((s) => s.userId === currentUser?.id);
  const upcomingSchedules = userSchedules.filter((s) => s.status === "upcoming");
  const missedSchedules = userSchedules.filter((s) => s.status === "missed");

  const recentNotifications = getUserNotifications().slice(0, 4);

  // Next upcoming vaccine schedule
  const nextVaccine = upcomingSchedules
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))[0];

  const statCards = [
    {
      label: t("totalTaken"),
      value: approvedRecords.length,
      desc: `${pendingRecords.length} pending verification`,
      icon: FileCheck2,
      color: "bg-blue-500",
      textColor: "text-blue-600 dark:text-sky-450",
      link: "/records"
    },
    {
      label: t("upcoming"),
      value: upcomingSchedules.length,
      desc: "Scheduled immunizations",
      icon: CalendarClock,
      color: "bg-emerald-500",
      textColor: "text-emerald-600 dark:text-emerald-400",
      link: "/scheduler"
    },
    {
      label: t("missed"),
      value: missedSchedules.length,
      desc: "Needs immediate rescheduling",
      icon: AlertOctagon,
      color: "bg-rose-500",
      textColor: "text-rose-600 dark:text-rose-400",
      link: "/scheduler"
    },
    {
      label: t("certificates"),
      value: approvedRecords.length,
      desc: "Verifiable QR credentials",
      icon: Award,
      color: "bg-sky-500",
      textColor: "text-sky-600 dark:text-sky-400",
      link: "/records"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 pointer-events-none hidden md:block">
          <ShieldCheck className="w-full h-full object-cover" />
        </div>
        <div className="max-w-xl">
          <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider">
            Patient Portfolio
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold mt-3 tracking-tight">
            {t("welcome")}, {currentUser?.name}!
          </h2>
          <p className="text-sm text-slate-100/90 mt-2 leading-relaxed">
            Your vaccination status is actively monitored. Ensure your profile records are up to date to receive correct booster recommendations.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm hover:shadow-md hover:scale-[1.01] transition duration-200 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center ${card.textColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-extrabold tracking-tight dark:text-white">{card.value}</span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">{card.label}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{card.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Health Card & Scheduler Widget */}
        <div className="lg:col-span-2 space-y-6">
          {/* Health Status Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="font-bold text-base text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-blue-500" />
              Patient Health Profile Status
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/50 border border-slate-100 dark:border-slate-800">
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Blood Group</span>
                <span className="text-sm font-extrabold text-blue-600 dark:text-sky-400">{currentUser?.bloodGroup || "Not Set"}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/50 border border-slate-100 dark:border-slate-800">
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Allergies</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate block">
                  {currentUser?.allergies?.length > 0 ? currentUser.allergies.join(", ") : "None"}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/50 border border-slate-100 dark:border-slate-800">
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Chronic Illness</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate block">
                  {currentUser?.chronicDiseases?.length > 0 ? currentUser.chronicDiseases.join(", ") : "None"}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/50 border border-slate-100 dark:border-slate-800">
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Pregnancy Status</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase">
                  {currentUser?.pregnancyStatus || "N/A"}
                </span>
              </div>
            </div>

            {/* Special Medical Safety Flags */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 flex items-start gap-3">
              <Flame className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
              <div>
                <h5 className="font-bold text-xs">Immunization Safety Notice</h5>
                <p className="text-[10px] leading-relaxed mt-0.5 opacity-90">
                  {currentUser?.allergies?.includes("Penicillin") 
                    ? "Warning: Allergy logged for Penicillin. Inform clinical practitioners before scheduling vaccine series that contain trace excipients."
                    : "Your safety profile checks out. Recommendation engine filters vaccines by age guidelines and underlying conditions."}
                  {currentUser?.pregnancyStatus === "yes" && " Highlight: You are flagged as pregnant. Seasonal flu shots and Tdap (weeks 27-36) are highly recommended. Avoid live attenuated vaccines."}
                </p>
              </div>
            </div>
          </div>

          {/* Upcoming Vaccination Widget */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-white">Next Scheduled Dose</h4>
                {nextVaccine ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="font-semibold text-blue-600 dark:text-sky-400">{nextVaccine.vaccineName}</span> (Dose {nextVaccine.doseNumber}) on{" "}
                    <span className="font-semibold">{new Date(nextVaccine.scheduledDate).toLocaleDateString()}</span>
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 mt-0.5">No upcoming schedules found. Book in the Smart Scheduler.</p>
                )}
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto shrink-0">
              <Link
                to="/scheduler"
                className="flex-grow sm:flex-grow-0 px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold text-center transition"
              >
                Manage Calendar
              </Link>
              {nextVaccine && (
                <Link
                  to="/records"
                  state={{ prefillVaccine: nextVaccine }}
                  className="flex-grow sm:flex-grow-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold text-center transition shadow-md shadow-blue-500/10"
                >
                  Log Vaccine Administered
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Activity Feed / Announcements */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-500" />
              Recent Updates & Alerts
            </h3>

            <div className="space-y-4">
              {recentNotifications.map((notif) => (
                <div key={notif.id} className="flex gap-3 items-start text-xs border-b border-slate-100 dark:border-slate-800/80 pb-3 last:border-0 last:pb-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${!notif.read ? "bg-blue-500" : "bg-slate-350 dark:bg-slate-700"}`} />
                  <div>
                    <h5 className={`font-bold ${!notif.read ? "text-slate-800 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
                      {notif.title}
                    </h5>
                    <p className="text-slate-400 dark:text-slate-500 leading-relaxed mt-0.5">{notif.message}</p>
                    <span className="text-[9px] text-slate-400/80 mt-1 block">
                      {new Date(notif.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/records"
            className="mt-6 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-bold text-blue-600 dark:text-sky-400 transition"
          >
            Review Certificates
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
