// React Hook: useState is a React Hook that lets you add state variables to your component.
import React, { useState } from "react";
// Context subscription hooks
import { useAuth } from "../context/AuthContext";
import { useVaccine } from "../context/VaccineContext";
import {
  CheckSquare,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FolderSearch,
  Eye,
  FileClock,
  ExternalLink,
  Info
} from "lucide-react";
import { toast } from "react-toastify";

// React Concept: AdminVerification renders administrative verification boards to review, approve or reject vaccine credentials
export default function AdminVerification() {
  // Global context retrievals
  const { users } = useAuth();
  const { records, approveRecord, rejectRecord, requestCorrection } = useVaccine();

  // useState: state variables for selected tab menu, inspected record, feedback text, and modal type flags
  const [activeTab, setActiveTab] = useState("pending"); // pending, approved, rejected/correction
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [modalType, setModalType] = useState(""); // reject, correction

  // Filter records based on tab status
  const filteredRecords = records.filter((r) => {
    if (activeTab === "pending") return r.verifiedStatus === "pending";
    if (activeTab === "approved") return r.verifiedStatus === "approved";
    // rejected or correction
    return r.verifiedStatus === "rejected" || r.verifiedStatus === "correction";
  });

  const getPatientName = (userId) => {
    const p = users.find((u) => u.id === userId);
    return p ? p.name : "Unknown Patient";
  };

  const handleApprove = (id, name, vaccine) => {
    if (window.confirm(`Approve vaccination certificate for ${name}'s ${vaccine}?`)) {
      approveRecord(id);
      toast.success(`Approved! Certificate generated for ${name}.`);
    }
  };

  const handleOpenFeedbackModal = (rec, type) => {
    setSelectedRecord(rec);
    setFeedbackText("");
    setModalType(type);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackText.trim() || !selectedRecord) {
      toast.error("Please provide feedback comments.");
      return;
    }

    if (modalType === "reject") {
      rejectRecord(selectedRecord.id, feedbackText.trim());
      toast.info(`Record for ${getPatientName(selectedRecord.userId)} rejected.`);
    } else {
      requestCorrection(selectedRecord.id, feedbackText.trim());
      toast.warning(`Correction request dispatched to ${getPatientName(selectedRecord.userId)}.`);
    }

    setSelectedRecord(null);
    setModalType("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold dark:text-white">Record Verification Console</h2>
        <p className="text-xs text-slate-400">Validate user documents and physician details before publishing digital credentials.</p>
      </div>

      {/* Tabbing Menu */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab("pending")}
          className={`pb-3 text-xs font-bold transition-all relative ${
            activeTab === "pending"
              ? "text-blue-600 dark:text-sky-400 border-b-2 border-blue-600 dark:border-sky-400"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Pending Inbox (
          {records.filter((r) => r.verifiedStatus === "pending").length}
          )
        </button>
        <button
          onClick={() => setActiveTab("approved")}
          className={`pb-3 text-xs font-bold transition-all relative ${
            activeTab === "approved"
              ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Approved Archive (
          {records.filter((r) => r.verifiedStatus === "approved").length}
          )
        </button>
        <button
          onClick={() => setActiveTab("rejected")}
          className={`pb-3 text-xs font-bold transition-all relative ${
            activeTab === "rejected"
              ? "text-rose-600 dark:text-rose-455 border-b-2 border-rose-600 dark:border-rose-455"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Rejected / Correction (
          {records.filter((r) => r.verifiedStatus === "rejected" || r.verifiedStatus === "correction").length}
          )
        </button>
      </div>

      {/* Verification Listing */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-12 text-center rounded-2xl max-w-sm mx-auto text-slate-400">
          <FolderSearch className="w-12 h-12 mx-auto text-slate-350 mb-3" />
          <h4 className="font-bold text-sm dark:text-white mb-1">No logs here</h4>
          <p className="text-xs">No records correspond to the selected state filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map((rec) => {
            const patientName = getPatientName(rec.userId);
            return (
              <div
                key={rec.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-805 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Header */}
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">{patientName}</h4>
                      <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Submitted Log</span>
                    </div>
                    {rec.verifiedStatus !== "pending" && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        rec.verifiedStatus === "approved" 
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                          : rec.verifiedStatus === "rejected" 
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" 
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-300 animate-pulse"
                      }`}>
                        {rec.verifiedStatus}
                      </span>
                    )}
                  </div>

                  {/* Vaccine particulars */}
                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-805 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold">Vaccine:</span>
                      <span className="font-bold text-blue-600 dark:text-sky-400 truncate max-w-[150px]">{rec.vaccineName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold">Dose Number:</span>
                      <span className="font-bold">{rec.doseNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold">Admin Date:</span>
                      <span className="font-semibold">{new Date(rec.vaccinationDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold">Hospital:</span>
                      <span className="font-semibold truncate max-w-[150px]">{rec.hospitalName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold">Physician:</span>
                      <span className="font-semibold truncate max-w-[150px]">{rec.doctorName}</span>
                    </div>
                    {rec.batchNumber && (
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-semibold">Batch Stamp:</span>
                        <span className="font-bold font-mono text-slate-500">{rec.batchNumber}</span>
                      </div>
                    )}
                  </div>

                  {/* Notes & File Attached */}
                  <div className="space-y-1 text-xs">
                    <span className="block font-bold text-slate-400 uppercase text-[9px] tracking-wider">Patient Notes</span>
                    <p className="text-slate-500 dark:text-slate-405 leading-relaxed bg-slate-50/50 dark:bg-slate-950/20 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 italic">
                      "{rec.notes || "No extra physician notes logged."}"
                    </p>
                  </div>

                  {/* Attached Document inspect indicator */}
                  {rec.fileName && (
                    <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-blue-500/5 border border-blue-500/10 text-blue-600 dark:text-sky-400 font-semibold">
                      <span className="truncate max-w-[180px]">{rec.fileName}</span>
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase cursor-pointer hover:underline">
                        Inspect file <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )}
                </div>

                {/* Verification Actions */}
                {rec.verifiedStatus === "pending" && (
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5">
                    <button
                      onClick={() => handleApprove(rec.id, patientName, rec.vaccineName)}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleOpenFeedbackModal(rec, "correction")}
                      className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold text-xs rounded-xl transition"
                      title="Request Correction"
                    >
                      Correction
                    </button>
                    <button
                      onClick={() => handleOpenFeedbackModal(rec, "reject")}
                      className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-455 rounded-xl transition"
                      title="Reject Log"
                    >
                      <XCircle className="w-4.5 h-4.5" />
                    </button>
                  </div>
                )}

                {/* If already corrected/rejected, show admin remarks */}
                {rec.verifiedStatus !== "pending" && rec.rejectionReason && (
                  <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-805 flex items-start gap-1.5 text-xs text-slate-500">
                    <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Remarks:</span> {rec.rejectionReason}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Admin Action Feedback Modal (Rejection / Correction message) */}
      {modalType && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm dark:text-white border-b border-slate-100 dark:border-slate-805 pb-3 mb-4 uppercase tracking-wider">
              {modalType === "reject" ? "Reject Record Log" : "Request Record Correction"}
            </h3>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <p className="text-xs text-slate-450 leading-relaxed mb-3">
                  Send details explaining why this log is {modalType === "reject" ? "rejected" : "marked for correction"}. The user will view this remark in their panel.
                </p>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows="3"
                  required
                  placeholder="e.g. Document image is blurry / Physician signature missing / Dose number conflicts with database history..."
                  className="w-full px-4 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-xl focus:outline-none dark:text-white"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-805">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRecord(null);
                    setModalType("");
                  }}
                  className="px-4 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-805 text-slate-650 dark:text-slate-350"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-xs font-semibold text-white rounded-xl shadow ${
                    modalType === "reject" ? "bg-rose-600 hover:bg-rose-700" : "bg-amber-600 hover:bg-amber-700"
                  }`}
                >
                  Send Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
