// React Router: useParams retrieves parameter placeholders from routing paths; Link handles relative route navigation links.
import React from "react";
import { useParams, Link } from "react-router-dom";
// Context subscription hooks
import { useAuth } from "../context/AuthContext";
import { useVaccine } from "../context/VaccineContext";
// qrcode.react: QR generator tool
import { QRCodeSVG } from "qrcode.react";
import { ShieldCheck, Download, Share2, ArrowLeft, Award, AwardIcon } from "lucide-react";
import { toast } from "react-toastify";

// React Concept: Certificate loads a matching vaccine verification layout based on route path parameters
export default function Certificate() {
  // useParams: fetches the specific vaccine ID from the active URL path parameters
  const { id } = useParams();

  // Context retrievals
  const { currentUser } = useAuth();
  const { records } = useVaccine();

  // Array lookup: find the specific vaccination record matching the ID
  const record = records.find((r) => r.id === id);

  if (!record || record.verifiedStatus !== "approved") {
    return (
      <div className="max-w-md mx-auto text-center py-12 space-y-4">
        <div className="text-rose-500 font-extrabold text-2xl">Access Denied</div>
        <p className="text-xs text-slate-400">
          This record is either not verified yet, or does not belong to your session profile.
        </p>
        <Link to="/records" className="text-xs text-blue-605 font-bold hover:underline">
          Back to Records
        </Link>
      </div>
    );
  }

  // Construct Verification URL
  const verificationUrl = `${window.location.origin}/verify?certId=${record.id}`;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(verificationUrl);
    toast.success("Verification link copied to clipboard!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 no-print">
        <div className="flex items-center gap-2">
          <Link
            to="/records"
            className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-bold dark:text-white">Immunization Certificate</h2>
            <p className="text-xs text-slate-400">Official medical credential generated for health clearing.</p>
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleShare}
            className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition text-slate-655 dark:text-slate-350"
          >
            <Share2 className="w-4 h-4 text-blue-500" />
            Share Credential
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow"
          >
            <Download className="w-4 h-4" />
            Download (Print PDF)
          </button>
        </div>
      </div>

      {/* Printable Certificate Board */}
      <div
        id="certificate-print-area"
        className="w-full bg-white dark:bg-slate-900 border-8 border-double border-blue-600/30 dark:border-slate-800/80 p-6 sm:p-12 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden"
      >
        {/* Background Security crest */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <ShieldCheck className="w-80 h-80 text-blue-600" />
        </div>

        {/* Certificate Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-b-2 border-slate-100 dark:border-slate-800 pb-6 gap-6 relative z-10 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-white">VaxShield Health Network</h3>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Verifiable Immunization Registry</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block sm:text-right">Certificate ID</span>
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-sky-450">{`VS-CERT-${record.id.toUpperCase()}`}</span>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="my-10 space-y-8 relative z-10 text-center">
          <div className="space-y-2">
            <Award className="w-12 h-12 text-blue-500 mx-auto" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              Certificate of Vaccination
            </h1>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              This official document confirms that the individual detailed below has been administered the following immunization course in accordance with clinical registry policies.
            </p>
          </div>

          {/* Patient Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Patient Full Name</span>
              <span className="text-sm font-bold text-slate-800 dark:text-white">{currentUser?.name}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date of Birth / Gender</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {currentUser?.dob ? new Date(currentUser.dob).toLocaleDateString() : "N/A"} ({currentUser?.gender})
              </span>
            </div>
          </div>

          {/* Vaccine Details Card */}
          <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-150 dark:border-slate-800 max-w-xl mx-auto grid grid-cols-2 gap-4 text-left">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Vaccine Name</span>
              <span className="text-xs font-bold text-blue-600 dark:text-sky-400">{record.vaccineName}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Dose Sequence</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Dose Number {record.doseNumber}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Date of Administration</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{new Date(record.vaccinationDate).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Batch / Lot Tag</span>
              <span className="text-xs font-bold text-slate-550 dark:text-slate-350">{record.batchNumber || "N/A"}</span>
            </div>
            <div className="col-span-2 border-t border-slate-200/50 dark:border-slate-800/80 pt-3">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Clinical Facility</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate block">
                {record.hospitalName} <span className="font-semibold text-slate-400">(Physician: {record.doctorName})</span>
              </span>
            </div>
          </div>
        </div>

        {/* Certificate Signatures Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-6 gap-6 relative z-10">
          <div className="text-center sm:text-left flex items-center gap-2 text-xs">
            {/* QR Verification Code */}
            <div className="p-2 border border-slate-200 dark:border-slate-700 bg-white rounded-lg inline-block">
              <QRCodeSVG value={verificationUrl} size={64} level="M" />
            </div>
            <div className="max-w-[150px] leading-relaxed">
              <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">Scan to Verify</span>
              <p className="text-[10px] text-slate-400">Scan QR to check credentials status in the central registry.</p>
            </div>
          </div>

          <div className="text-center sm:text-right text-xs">
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Registry Authority</span>
            <div className="h-6 font-serif italic text-sm text-slate-750 dark:text-slate-350 mt-1">Dr. Sarah Carter</div>
            <div className="w-32 border-b border-slate-300 dark:border-slate-700 mx-auto sm:ml-auto my-1" />
            <span className="text-[9px] font-semibold text-emerald-500 block uppercase tracking-widest">
              Digital Signature Active
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
