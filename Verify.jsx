import React from "react";
import { useLocation, Link } from "react-router-dom";
import { ShieldCheck, ShieldAlert, XCircle, ArrowLeft, Home, BadgeCheck } from "lucide-react";
//used router 
export default function Verify() {
  const location = useLocation();

  // Parse certId from query parameters
  const queryParams = new URLSearchParams(location.search);
  const certId = queryParams.get("certId");

  // Read raw local storage database
  const rawRecords = localStorage.getItem("vaccineRecords");
  const rawUsers = localStorage.getItem("users");

  const records = rawRecords ? JSON.parse(rawRecords) : [];
  const users = rawUsers ? JSON.parse(rawUsers) : [];

  const record = records.find((r) => r.id === certId);
  const patient = record ? users.find((u) => u.id === record.userId) : null;

  const getVerificationResult = () => {
    if (!certId || !record) {
      return {
        status: "invalid",
        title: "Invalid Certificate",
        desc: "The Certificate ID was not found in the official registry database. The QR credential may be invalid or forged.",
        colorClass: "border-rose-500/25 bg-rose-500/5 text-rose-600 dark:text-rose-400",
        icon: XCircle
      };
    }

    if (record.verifiedStatus !== "approved") {
      return {
        status: "invalid",
        title: "Certification Pending / Rejected",
        desc: "This vaccination log has not been validated by the registry administrator. It is currently locked or flagged.",
        colorClass: "border-amber-500/25 bg-amber-500/5 text-amber-600 dark:text-amber-300",
        icon: ShieldAlert
      };
    }

    // Check if expired (if nextDueDate exists and is in the past)
    if (record.nextDueDate) {
      const today = new Date();
      const dueDate = new Date(record.nextDueDate);
      if (today > dueDate) {
        return {
          status: "expired",
          title: "Immunization Expired",
          desc: "This booster course has passed its next due threshold. A booster is required to restore active immunization status.",
          colorClass: "border-amber-500/25 bg-amber-500/5 text-amber-600 dark:text-amber-300",
          icon: ShieldAlert
        };
      }
    }

    return {
      status: "verified",
      title: "Authentic & Verified",
      desc: "This digital immunization credential has been validated against the official registry. Details match the clinical source.",
      colorClass: "border-emerald-500/25 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400",
      icon: BadgeCheck
    };
  };

  const result = getVerificationResult();
  const Icon = result.icon;

  return (
    <div className="min-h-screen flex flex-col justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-md w-full mx-auto space-y-6">
        
        {/* Brand logo */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h2 className="mt-3 font-bold text-xl dark:text-white">VaxShield Registry</h2>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Public Credentials Validator</span>
        </div>

        {/* Verification Board */}
        <div className={`p-6 rounded-2xl border bg-white dark:bg-slate-800 shadow-xl space-y-6 ${result.colorClass}`}>
          <div className="flex flex-col items-center text-center">
            <Icon className="w-16 h-16 mb-4 animate-pulse" />
            <h3 className="font-extrabold text-lg tracking-tight">{result.title}</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-xs">{result.desc}</p>
          </div>

          {/* Record Metadata (Conditionally Rendered on success/expired) */}
          {record && (
            <div className="space-y-3 pt-4 border-t border-slate-200/50 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs">
              <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Verification Particulars</h4>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-400">Patient Name:</span>
                <span className="font-bold">{patient?.name || "Verified Anonymous Patient"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-400">Vaccine Administered:</span>
                <span className="font-bold">{record.vaccineName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-400">Dose Index:</span>
                <span className="font-bold">Dose {record.doseNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-400">Administration Date:</span>
                <span className="font-semibold">{new Date(record.vaccinationDate).toLocaleDateString()}</span>
              </div>
              {record.nextDueDate && (
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-400">Next Due Threshold:</span>
                  <span className="font-semibold">{new Date(record.nextDueDate).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-semibold text-slate-400">Facility / Hospital:</span>
                <span className="font-bold truncate max-w-[200px]" title={record.hospitalName}>{record.hospitalName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-400">Validation Authority:</span>
                <span className="font-bold">{record.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-400">Stamp ID:</span>
                <span className="font-mono text-[10px] font-bold text-blue-500">{record.batchNumber}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="flex justify-center gap-4 text-xs font-semibold">
          <Link to="/" className="inline-flex items-center gap-1 text-slate-500 hover:underline">
            <Home className="w-4 h-4" />
            Home Portal
          </Link>
          <span className="text-slate-350">•</span>
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign In to VaxShield
          </Link>
        </div>

      </div>
    </div>
  );
}
