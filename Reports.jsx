// React Hook: useState is a React Hook that lets you add local state variables to your component.
import React, { useState } from "react";
// Context subscription hooks
import { useAuth } from "../context/AuthContext";
import { useVaccine } from "../context/VaccineContext";
import { FileSpreadsheet, FileText, Download, Printer, Filter } from "lucide-react";
import { toast } from "react-toastify";

// React Concept: Reports component handles report compilation and CSV exports from global contexts
export default function Reports() {
  // Global context retrievals
  const { users } = useAuth();
  const { records } = useVaccine();
  
  // useState: state variable for report category selection
  const [reportType, setReportType] = useState("users"); // users, vaccinations, certificates

  const patientUsers = users.filter((u) => u.role === "user");
  const approvedRecords = records.filter((r) => r.verifiedStatus === "approved");

  // Format data for exporting & displaying
  const getUsersData = () => {
    return patientUsers.map((u) => ({
      ID: u.id,
      Name: u.name,
      Email: u.email,
      DOB: u.dob,
      Gender: u.gender,
      BloodGroup: u.bloodGroup,
      Status: u.status
    }));
  };

  const getVaccinationsData = () => {
    return records.map((r) => {
      const patient = users.find((u) => u.id === r.userId);
      return {
        RecordID: r.id,
        PatientName: patient ? patient.name : "Unknown",
        VaccineName: r.vaccineName,
        Dose: r.doseNumber,
        DateAdministered: r.vaccinationDate,
        Hospital: r.hospitalName,
        Physician: r.doctorName,
        BatchNumber: r.batchNumber,
        VerificationStatus: r.verifiedStatus
      };
    });
  };

  const getCertificatesData = () => {
    return approvedRecords.map((r) => {
      const patient = users.find((u) => u.id === r.userId);
      return {
        CertificateID: `VS-CERT-${r.id.toUpperCase()}`,
        PatientName: patient ? patient.name : "Unknown",
        VaccineName: r.vaccineName,
        Dose: r.doseNumber,
        DateVerified: r.vaccinationDate,
        Clinic: r.hospitalName
      };
    });
  };

  // Convert array to CSV string and trigger browser download
  const handleExportCSV = () => {
    let data = [];
    let filename = "";

    if (reportType === "users") {
      data = getUsersData();
      filename = "vaxshield_patients_report.csv";
    } else if (reportType === "vaccinations") {
      data = getVaccinationsData();
      filename = "vaxshield_vaccinations_report.csv";
    } else {
      data = getCertificatesData();
      filename = "vaxshield_certificates_report.csv";
    }

    if (data.length === 0) {
      toast.error("No data available to export.");
      return;
    }

    // Generate CSV headers and rows
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","), // header row
      ...data.map((row) =>
        headers
          .map((fieldName) => {
            // Escape double quotes and enclose values containing commas
            const value = String(row[fieldName] || "").replace(/"/g, '""');
            return value.includes(",") ? `"${value}"` : value;
          })
          .join(",")
      )
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`${filename} downloaded successfully!`);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const currentData = 
    reportType === "users" 
      ? getUsersData() 
      : reportType === "vaccinations" 
        ? getVaccinationsData() 
        : getCertificatesData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 no-print">
        <div>
          <h2 className="text-xl font-bold dark:text-white">Registry Reports Exporter</h2>
          <p className="text-xs text-slate-400">Compile patient cohorts, log histories, and export spreadsheet files.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePrintPDF}
            className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition text-slate-655 dark:text-slate-350"
          >
            <Printer className="w-4 h-4" />
            Print Report (PDF)
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export to Excel
          </button>
        </div>
      </div>

      {/* Selector and filters menu */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm flex flex-wrap gap-4 items-center justify-between no-print">
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setReportType("users")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              reportType === "users"
                ? "bg-white dark:bg-slate-900 shadow-sm text-blue-650 dark:text-sky-400"
                : "text-slate-550 hover:text-slate-700"
            }`}
          >
            User Accounts
          </button>
          <button
            onClick={() => setReportType("vaccinations")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              reportType === "vaccinations"
                ? "bg-white dark:bg-slate-900 shadow-sm text-blue-650 dark:text-sky-400"
                : "text-slate-550 hover:text-slate-700"
            }`}
          >
            Vaccination History
          </button>
          <button
            onClick={() => setReportType("certificates")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              reportType === "certificates"
                ? "bg-white dark:bg-slate-900 shadow-sm text-blue-650 dark:text-sky-400"
                : "text-slate-550 hover:text-slate-700"
            }`}
          >
            Certificates Log
          </button>
        </div>

        <span className="text-xs text-slate-400 font-bold">
          Dataset Records: <span className="text-slate-800 dark:text-white">{currentData.length}</span>
        </span>
      </div>

      {/* Reports Board */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden" id="certificate-print-area">
        {/* Print-only title */}
        <div className="hidden print:block p-6 border-b border-slate-200 text-center">
          <h1 className="text-xl font-bold uppercase tracking-wider">VaxShield Registry Official Report</h1>
          <p className="text-xs text-slate-400 mt-1">Generated: {new Date().toLocaleDateString()} | Type: {reportType.toUpperCase()}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {currentData.length > 0 &&
                  Object.keys(currentData[0]).map((key) => (
                    <th key={key} className="p-4">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {currentData.length === 0 ? (
                <tr>
                  <td className="p-8 text-center text-slate-400 italic">No reportable entries present in current database state.</td>
                </tr>
              ) : (
                currentData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/25 transition-colors">
                    {Object.values(row).map((val, cellIdx) => (
                      <td key={cellIdx} className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
