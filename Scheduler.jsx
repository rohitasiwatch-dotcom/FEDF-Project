// React Hook: useState lets you add local state variables to your component.
// React Hook: useEffect lets you synchronize a component with an external system.
import React, { useState, useEffect } from "react";
// React Router: useLocation retrieves navigation history state parameters
import { useLocation } from "react-router-dom";
// react-hook-form: Form validation library, used here twice to handle scheduling and marking completion
import { useForm } from "react-hook-form";
// Context subscription hooks
import { useAuth } from "../context/AuthContext";
import { useVaccine } from "../context/VaccineContext";
import {
  CalendarDays,
  Clock,
  CheckCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  Building,
  ArrowRight,
  FileCheck2,
  Trash2
} from "lucide-react";
import { toast } from "react-toastify";

// React Concept: Scheduler allows patient booking, calendar grids, rescheduling, and completions
export default function Scheduler() {
  // Global context retrievals
  const { currentUser } = useAuth();
  const {
    schedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    completeScheduleRecord
  } = useVaccine();
  const location = useLocation();

  // useState: local states for active view (upcoming, monthly, weekly), month selector, modal triggers, and selected schedule cards
  const [view, setView] = useState("upcoming"); // upcoming, monthly, weekly
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  
  // useForm Hooks: first form instance for booking, second for marking completion
  const {
    register: registerBook,
    handleSubmit: handleBookSubmit,
    reset: resetBookForm,
    formState: { errors: bookErrors }
  } = useForm();

  const {
    register: registerComplete,
    handleSubmit: handleCompleteSubmit,
    reset: resetCompleteForm,
    formState: { errors: completeErrors }
  } = useForm();

  // useEffect
  // React Hook: useEffect to check if the route transition contains a recommended vaccine payload to prefill booking inputs
  useEffect(() => {
    if (location.state?.prefillSchedule) {
      const p = location.state.prefillSchedule;
      setSelectedSchedule(null);
      resetBookForm({
        vaccineName: p.vaccineName,
        doseNumber: 1,
        scheduledDate: p.suggestedDate
      });
      setScheduleModalOpen(true);
    }
  }, [location, resetBookForm]);

  const userSchedules = schedules
    .filter((s) => s.userId === currentUser?.id)
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

  // Booking submit
  const onBookSubmit = (data) => {
    addSchedule({
      vaccineName: data.vaccineName,
      doseNumber: Number(data.doseNumber),
      scheduledDate: data.scheduledDate
    });
    setScheduleModalOpen(false);
    toast.success(`${data.vaccineName} scheduled successfully!`);
  };

  // Reschedule inline date change
  const handleReschedule = (id, newDate) => {
    if (newDate) {
      updateSchedule(id, newDate);
      toast.success("Appointment date rescheduled!");
    }
  };

  // Completion submit
  const onCompleteSubmit = (data) => {
    if (!selectedSchedule) return;
    
    completeScheduleRecord(selectedSchedule.id, {
      vaccinationDate: data.vaccinationDate,
      hospitalName: data.hospitalName,
      doctorName: data.doctorName,
      batchNumber: data.batchNumber,
      notes: data.notes
    });

    setCompleteModalOpen(false);
    toast.success("Vaccine marked complete. Submitted for verification!");
  };

  const handleOpenCompleteModal = (sch) => {
    setSelectedSchedule(sch);
    resetCompleteForm({
      vaccinationDate: new Date().toISOString().split("T")[0],
      hospitalName: "",
      doctorName: "",
      batchNumber: "",
      notes: "Log completed from schedule card."
    });
    setCompleteModalOpen(true);
  };

  const handleDeleteSchedule = (id) => {
    if (window.confirm("Cancel this scheduled vaccination?")) {
      deleteSchedule(id);
      toast.success("Schedule cancelled.");
    }
  };

  // Calendar logic helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay(); // 0 is Sunday
  };

  const renderMonthlyGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const blanks = Array(firstDay).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const totalSlots = [...blanks, ...days];

    const currentMonthName = currentDate.toLocaleString("en-US", { month: "long", year: "numeric" });

    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
        {/* Month Picker Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white">{currentMonthName}</h3>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4 text-slate-500" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest gap-2">
          <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
        </div>

        {/* Grid Slots */}
        <div className="grid grid-cols-7 gap-2">
          {totalSlots.map((slot, index) => {
            const isToday =
              slot &&
              slot === new Date().getDate() &&
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear();

            // Check if there are schedules on this day
            const slotDateString = slot
              ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(slot).padStart(2, "0")}`
              : "";
            
            const daySchedules = userSchedules.filter(
              (s) => s.scheduledDate === slotDateString && s.status === "upcoming"
            );

            return (
              <div
                key={index}
                className={`min-h-[60px] p-1 border border-slate-100 dark:border-slate-800 rounded-lg flex flex-col justify-between ${
                  slot ? "bg-slate-50/50 dark:bg-slate-950/20" : "bg-transparent"
                } ${isToday ? "ring-2 ring-blue-500 bg-blue-50/20" : ""}`}
              >
                {slot && <span className="text-[10px] font-semibold text-slate-400">{slot}</span>}
                {daySchedules.map((ds) => (
                  <div
                    key={ds.id}
                    className="text-[9px] font-bold bg-blue-500/10 text-blue-600 dark:text-sky-400 p-1 rounded truncate cursor-pointer"
                    onClick={() => handleOpenCompleteModal(ds)}
                    title={`${ds.vaccineName} (Dose ${ds.doseNumber}) - click to complete`}
                  >
                    {ds.vaccineName.split(" ")[0]}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold dark:text-white">Smart Vaccination Scheduler</h2>
          <p className="text-xs text-slate-400">Plan dose courses, reschedule upcoming bookings, and log administrations.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View selector */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setView("upcoming")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                view === "upcoming" ? "bg-white dark:bg-slate-900 shadow-sm text-blue-600 dark:text-sky-400 font-bold" : "text-slate-500"
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setView("monthly")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                view === "monthly" ? "bg-white dark:bg-slate-900 shadow-sm text-blue-600 dark:text-sky-400 font-bold" : "text-slate-500"
              }`}
            >
              Monthly View
            </button>
          </div>

          <button
            onClick={() => {
              setSelectedSchedule(null);
              resetBookForm({
                vaccineName: "",
                doseNumber: 1,
                scheduledDate: ""
              });
              setScheduleModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs transition shadow-md shadow-blue-500/10"
          >
            <Plus className="w-4 h-4" />
            Book Dose
          </button>
        </div>
      </div>

      {/* Primary Display */}
      {view === "monthly" ? (
        renderMonthlyGrid()
      ) : (
        /* Upcoming Schedule Lists */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userSchedules.filter(s => s.status !== "completed").length === 0 ? (
            <div className="col-span-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-12 text-center rounded-2xl max-w-sm mx-auto">
              <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-sm dark:text-white mb-1">No Active Bookings</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">You have no upcoming or missed immunization schedules logged.</p>
              <button
                onClick={() => setScheduleModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition"
              >
                Schedule Appointment
              </button>
            </div>
          ) : (
            userSchedules.filter(s => s.status !== "completed").map((sch) => (
              <div
                key={sch.id}
                className={`bg-white dark:bg-slate-900 border p-5 rounded-2xl shadow-sm flex flex-col justify-between gap-4 transition duration-200 ${
                  sch.status === "missed" ? "border-rose-500/30" : "border-slate-200/50 dark:border-slate-800"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate max-w-[150px]" title={sch.vaccineName}>
                        {sch.vaccineName}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400">Dose {sch.doseNumber}</span>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                      sch.status === "missed" 
                        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" 
                        : "bg-blue-500/10 text-blue-600 dark:text-sky-400"
                    }`}>
                      {sch.status}
                    </span>
                  </div>

                  {/* Rescheduling Form - Datepicker */}
                  <div className="mt-4 space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scheduled Target Date</label>
                    <input
                      type="date"
                      value={sch.scheduledDate}
                      onChange={(e) => handleReschedule(sch.id, e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-850">
                  <button
                    onClick={() => handleOpenCompleteModal(sch)}
                    className="flex-grow py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    Mark Complete
                  </button>
                  <button
                    onClick={() => handleDeleteSchedule(sch.id)}
                    className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl transition"
                    title="Cancel Appointment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Appointment Booking Modal */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-base dark:text-white border-b border-slate-100 dark:border-slate-850 pb-3 mb-4">
              Schedule Vaccine Dose
            </h3>

            <form onSubmit={handleBookSubmit(onBookSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Vaccine Name *</label>
                <input
                  type="text"
                  {...registerBook("vaccineName", { required: "Vaccine name is required" })}
                  placeholder="e.g. Hepatitis B / Tdap"
                  className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                />
                {bookErrors.vaccineName && <span className="text-[10px] text-rose-500 mt-1 block">{bookErrors.vaccineName.message}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Dose Number *</label>
                  <input
                    type="number"
                    min="1"
                    defaultValue="1"
                    {...registerBook("doseNumber", { required: "Dose number is required" })}
                    className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Target Date *</label>
                  <input
                    type="date"
                    {...registerBook("scheduledDate", { required: "Date is required" })}
                    className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none dark:text-white"
                  />
                  {bookErrors.scheduledDate && <span className="text-[10px] text-rose-500 mt-1 block">{bookErrors.scheduledDate.message}</span>}
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-805">
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow"
                >
                  Schedule Dose
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mark Administered Complete Modal */}
      {completeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-base dark:text-white border-b border-slate-100 dark:border-slate-850 pb-3 mb-4">
              Confirm Administration: {selectedSchedule?.vaccineName}
            </h3>

            <form onSubmit={handleCompleteSubmit(onCompleteSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Administration Date *</label>
                  <input
                    type="date"
                    {...registerComplete("vaccinationDate", { required: "Date is required" })}
                    className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none dark:text-white"
                  />
                  {completeErrors.vaccinationDate && <span className="text-[10px] text-rose-500 mt-1 block">{completeErrors.vaccinationDate.message}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Batch Number</label>
                  <input
                    type="text"
                    {...registerComplete("batchNumber")}
                    placeholder="e.g. CZ9921"
                    className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Hospital / Clinic *</label>
                  <input
                    type="text"
                    {...registerComplete("hospitalName", { required: "Hospital name is required" })}
                    placeholder="e.g. General Hospital"
                    className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none dark:text-white"
                  />
                  {completeErrors.hospitalName && <span className="text-[10px] text-rose-500 mt-1 block">{completeErrors.hospitalName.message}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Doctor Name *</label>
                  <input
                    type="text"
                    {...registerComplete("doctorName", { required: "Doctor name is required" })}
                    placeholder="e.g. Dr. Vance"
                    className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none dark:text-white"
                  />
                  {completeErrors.doctorName && <span className="text-[10px] text-rose-500 mt-1 block">{completeErrors.doctorName.message}</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Physician Notes</label>
                <textarea
                  {...registerComplete("notes")}
                  rows="2"
                  placeholder="Notes..."
                  className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none dark:text-white"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-805">
                <button
                  type="button"
                  onClick={() => setCompleteModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-805 text-slate-650 dark:text-slate-350"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow"
                >
                  Confirm Administered
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
