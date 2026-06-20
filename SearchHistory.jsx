// React Hook: useState is a React Hook that lets you add local state variables to your component.
import React, { useState } from "react";
// React Router: Link handles navigation back to cert pages
import { Link } from "react-router-dom";
// Context subscription hooks
import { useAuth } from "../context/AuthContext";
import { useVaccine } from "../context/VaccineContext";
import {
  Search,
  Calendar,
  Building,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  FileSymlink,
  Eye,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";

// React Concept: SearchHistory renders a list of vaccine records with custom filters, search fields, and client-side pagination.
export default function SearchHistory() {
  // Global context retrievals
  const { currentUser } = useAuth();
  const { records } = useVaccine();
 
  // useState: local states for queries and filter options
  const [searchQuery, setSearchQuery] = useState("");
  const [filterHospital, setFilterHospital] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
 
  // useState: state tracker for pagination page index
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const userRecords = records.filter((r) => r.userId === currentUser?.id);

  // Extract unique hospital names for filter dropdown
  const uniqueHospitals = Array.from(
    new Set(userRecords.map((r) => r.hospitalName))
  ).sort();

  // Filtering Logic
  const filteredRecords = userRecords
    .filter((r) => {
      const nameMatch = r.vaccineName.toLowerCase().includes(searchQuery.toLowerCase());
      const hospitalMatch = !filterHospital || r.hospitalName === filterHospital;
      const statusMatch = filterStatus === "all" || r.verifiedStatus === filterStatus;
      
      let dateMatch = true;
      if (startDate) {
        dateMatch = dateMatch && new Date(r.vaccinationDate) >= new Date(startDate);
      }
      if (endDate) {
        dateMatch = dateMatch && new Date(r.vaccinationDate) <= new Date(endDate);
      }
      
      return nameMatch && hospitalMatch && statusMatch && dateMatch;
    })
    .sort((a, b) => new Date(b.vaccinationDate) - new Date(a.vaccinationDate)); // newest first

  // Pagination Logic
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <CheckCircle className="w-3 h-3" />
            Verified
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      case "correction":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-300 text-xs font-bold">
            <AlertTriangle className="w-3 h-3 animate-pulse" />
            Correction
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-sky-400 text-xs font-bold">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterHospital("");
    setFilterStatus("all");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold dark:text-white">Search & History</h2>
        <p className="text-xs text-slate-400">Search and filter your entire immunization record log.</p>
      </div>

      {/* Advanced Filter panel */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase border-b border-slate-100 dark:border-slate-800 pb-2">
          <Filter className="w-4.5 h-4.5 text-blue-500" />
          <span>Filter Criteria</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Query */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Search Vaccine Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="e.g. COVID, Flu"
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white"
              />
            </div>
          </div>

          {/* Hospital Select */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Filter by Hospital</label>
            <select
              value={filterHospital}
              onChange={(e) => {
                setFilterHospital(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white"
            >
              <option value="">All Hospitals</option>
              {uniqueHospitals.map((h, i) => (
                <option key={i} value={h}>{h}</option>
              ))}
            </select>
          </div>

          {/* Status Select */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white"
            >
              <option value="all">All Statuses</option>
              <option value="approved">Verified (Approved)</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="correction">Correction Required</option>
            </select>
          </div>

          {/* Date range picker */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Vaccination Date Range</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white"
              />
              <span className="text-xs text-slate-400">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold transition text-slate-600 dark:text-slate-350"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-4">Vaccine Name</th>
                <th className="p-4">Dose No.</th>
                <th className="p-4">Date</th>
                <th className="p-4">Hospital / Center</th>
                <th className="p-4">Doctor</th>
                <th className="p-4">Batch Number</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400 italic">
                    No matching vaccination records found. Try adjusting your search query.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
                    <td className="p-4 font-bold text-slate-800 dark:text-white">{rec.vaccineName}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400 font-semibold">{rec.doseNumber}</td>
                    <td className="p-4 font-semibold">{new Date(rec.vaccinationDate).toLocaleDateString()}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400 truncate max-w-[150px]">{rec.hospitalName}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400 truncate max-w-[120px]">{rec.doctorName}</td>
                    <td className="p-4"><span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-400 uppercase">{rec.batchNumber || "N/A"}</span></td>
                    <td className="p-4">{getStatusBadge(rec.verifiedStatus)}</td>
                    <td className="p-4 text-right">
                      {rec.verifiedStatus === "approved" ? (
                        <Link
                          to={`/certificate/${rec.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[10px] shadow"
                        >
                          <FileSymlink className="w-3 h-3" />
                          Certificate
                        </Link>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Locked</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Showing page <span className="font-semibold text-slate-700 dark:text-slate-200">{currentPage}</span> of{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">{totalPages}</span>
            </span>

            <div className="flex gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 text-slate-500"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 text-slate-500"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
