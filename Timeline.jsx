import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useVaccine } from "../context/VaccineContext";
import {
  //used re rendering
  CalendarDays,
  CheckCircle,
  Clock,
  AlertCircle,
  Activity,
  Filter,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileCheck
} from "lucide-react";
import { toast } from "react-toastify";

export default function Timeline() {
  const { currentUser } = useAuth();
  const { records, schedules, getRecommendations } = useVaccine();
  const navigate = useNavigate();

  // Filters
  const [filterYear, setFilterYear] = useState("all");
  const [filterVaccine, setFilterVaccine] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [recommendations, setRecommendations] = useState([]);

  // Compute recommendations when user changes
  useEffect(() => {
    if (currentUser) {
      setRecommendations(getRecommendations(currentUser));
    }
  }, [currentUser, records]);

  // Aggregate timeline items
  // Completed items from approved records
  const completedItems = records
    .filter((r) => r.userId === currentUser?.id && r.verifiedStatus === "approved")
    .map((r) => ({
      id: r.id,
      name: r.vaccineName,
      dose: r.doseNumber,
      date: r.vaccinationDate,
      status: "completed",
      hospital: r.hospitalName
    }));

  // Upcoming/Missed items from schedules
  const scheduledItems = schedules
    .filter((s) => s.userId === currentUser?.id && (s.status === "upcoming" || s.status === "missed"))
    .map((s) => ({
      id: s.id,
      name: s.vaccineName,
      dose: s.doseNumber,
      date: s.scheduledDate,
      status: s.status,
      hospital: "Scheduled Session"
    }));

  const allTimelineItems = [...completedItems, ...scheduledItems].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Years for filter dropdown
  const years = Array.from(
    new Set(allTimelineItems.map((item) => new Date(item.date).getFullYear().toString()))
  ).sort();

  // Unique vaccine names for filter dropdown
  const vaccineNames = Array.from(
    new Set(allTimelineItems.map((item) => item.name))
  ).sort();

  // Filter logic
  const filteredTimeline = allTimelineItems.filter((item) => {
    const yearMatch = filterYear === "all" || new Date(item.date).getFullYear().toString() === filterYear;
    const vaccineMatch = filterVaccine === "all" || item.name === filterVaccine;
    const statusMatch = filterStatus === "all" || item.status === filterStatus;
    return yearMatch && vaccineMatch && statusMatch;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border-2 border-emerald-500/20 shadow-sm">
            <CheckCircle className="w-4.5 h-4.5" />
          </div>
        );
      case "missed":
        return (
          <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-450 flex items-center justify-center border-2 border-rose-500/20 shadow-sm animate-pulse">
            <AlertCircle className="w-4.5 h-4.5" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 dark:text-sky-400 flex items-center justify-center border-2 border-blue-500/20 shadow-sm">
            <Clock className="w-4.5 h-4.5" />
          </div>
        );
    }
  };

  const getPriorityBadge = (prio) => {
    if (prio === "High") {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-450 uppercase">
          High Priority
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-300 uppercase">
        Routine
      </span>
    );
  };

  const handleBookRecommendation = (rec) => {
    // Redirect to scheduler and prefill the vaccine name
    navigate("/scheduler", { state: { prefillSchedule: rec } });
    toast.info(`Booking schedule for ${rec.vaccineName}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Timeline List (Columns 1 & 2) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold dark:text-white">Immunization Timeline</h2>
            <p className="text-xs text-slate-400">Track past administrations and upcoming schedule blocks.</p>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-1 text-xs text-slate-400 font-bold uppercase">
            <Filter className="w-4.5 h-4.5 text-slate-400" />
            <span>Filters:</span>
          </div>

          {/* Year */}
          <div className="flex-1 min-w-[120px]">
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white"
            >
              <option value="all">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Vaccine */}
          <div className="flex-grow min-w-[150px]">
            <select
              value={filterVaccine}
              onChange={(e) => setFilterVaccine(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white"
            >
              <option value="all">All Vaccines</option>
              {vaccineNames.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="flex-1 min-w-[120px]">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="upcoming">Upcoming</option>
              <option value="missed">Missed</option>
            </select>
          </div>
        </div>

        {/* Timeline Visual Grid */}
        {filteredTimeline.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400">
            <CalendarDays className="w-12 h-12 mx-auto text-slate-350 mb-2" />
            <p className="text-xs">No matching timeline events found.</p>
          </div>
        ) : (
          <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-6 pt-2">
            {filteredTimeline.map((item) => (
              <div key={item.id} className="relative group">
                {/* Node Icon */}
                <div className="absolute left-[-41px] top-0.5 bg-slate-50 dark:bg-slate-900 p-0.5 rounded-full z-10">
                  {getStatusIcon(item.status)}
                </div>

                {/* Event Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      {new Date(item.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-800 dark:text-white mt-1">
                      {item.name} <span className="font-semibold text-xs text-slate-400">(Dose {item.dose})</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">{item.hospital}</p>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      item.status === "completed" 
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                        : item.status === "missed" 
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" 
                          : "bg-blue-500/10 text-blue-600 dark:text-sky-400"
                    }`}>
                      {item.status}
                    </span>

                    {item.status === "completed" && (
                      <Link
                        to="/records"
                        className="text-xs text-slate-400 hover:text-blue-500 dark:hover:text-sky-400 flex items-center gap-1 font-semibold"
                      >
                        View Details
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    
                    {item.status === "missed" && (
                      <Link
                        to="/scheduler"
                        className="text-xs text-rose-500 hover:underline font-bold flex items-center gap-1"
                      >
                        Reschedule Now
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Recommendation Engine (Column 3) */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-sky-450 animate-pulse" />
          <h2 className="text-xl font-bold dark:text-white">Recommended Doses</h2>
        </div>

        <div className="space-y-4">
          {recommendations.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-2xl text-center text-slate-400">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs">Congratulations! Your immunization records match all routine guidelines for your health profile.</p>
            </div>
          ) : (
            recommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4 hover:border-blue-500/30 transition-all duration-200"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-850 dark:text-white">{rec.vaccineName}</h4>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Suggested Date: {new Date(rec.suggestedDate).toLocaleDateString()}</span>
                  </div>
                  {getPriorityBadge(rec.priority)}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-950 p-3 rounded-xl">
                  {rec.reason}
                </p>

                <button
                  onClick={() => handleBookRecommendation(rec)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition shadow shadow-blue-500/10 flex items-center justify-center gap-2"
                >
                  Schedule Appointment
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
