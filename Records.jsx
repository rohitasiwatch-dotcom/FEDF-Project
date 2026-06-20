// React Hook: useState lets you add local state variables to your component.
// React Hook: useEffect lets you synchronize a component with an external system.
import React, { useState, useEffect } from "react";
// React Router: useLocation extracts navigation history state parameters; Link handles routing
import { useLocation, Link } from "react-router-dom";
// react-hook-form: Form validation and tracking library
import { useForm } from "react-hook-form";
// Context subscription hooks
import { useAuth } from "../context/AuthContext";
import { useVaccine } from "../context/VaccineContext";
import {
  FilePlus2,
  Edit2,
  Trash2,
  FileCheck,
  FileClock,
  FileX,
  FileSymlink,
  Eye,
  Calendar,
  Building,
  User,
  Paperclip,
  CheckCircle,
  AlertTriangle,
  FolderOpen
} from "lucide-react";
import { toast } from "react-toastify";

// React Concept: Records renders lists of logged vaccines, handles add/edit modals and attachments
export default function Records() {
  // Global context data extraction
  const { currentUser } = useAuth();
  const { records, addRecord, updateRecord, deleteRecord } = useVaccine();
  const location = useLocation();

  // useState: local states for modal open/close toggles, record editor data, and file attachments
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [activePreviewUrl, setActivePreviewUrl] = useState("");
  const [activePreviewType, setActivePreviewType] = useState("");

  const userRecords = records.filter((r) => r.userId === currentUser?.id);

  // useForm Hook: form controls initialization
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm();

  const handleOpenAddModal = () => {
    setEditingRecord(null);
    setSelectedFile(null);
    reset({
      vaccineName: "",
      doseNumber: 1,
      vaccinationDate: "",
      hospitalName: "",
      doctorName: "",
      batchNumber: "",
      nextDueDate: "",
      notes: ""
    });
    setModalOpen(true);
  };

  // useEffect
  // React Hook: useEffect to listen to route transitions and programmatically open/prefill modal dialogs
  useEffect(() => {
    if (location.state?.openAddModal) {
      handleOpenAddModal();
    }
    if (location.state?.prefillVaccine) {
      handleOpenAddModal();
      const p = location.state.prefillVaccine;
      setValue("vaccineName", p.vaccineName);
      setValue("doseNumber", p.doseNumber);
      setValue("vaccinationDate", new Date().toISOString().split("T")[0]);
    }
  }, [location, setValue]);

  const handleOpenEditModal = (rec) => {
    setEditingRecord(rec);
    setSelectedFile(null);
    reset({
      vaccineName: rec.vaccineName,
      doseNumber: rec.doseNumber,
      vaccinationDate: rec.vaccinationDate,
      hospitalName: rec.hospitalName,
      doctorName: rec.doctorName,
      batchNumber: rec.batchNumber,
      nextDueDate: rec.nextDueDate,
      notes: rec.notes
    });
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFormSubmit = (data) => {
    const fileName = selectedFile ? selectedFile.name : (editingRecord ? editingRecord.fileName : "");
    
    const recordPayload = {
      vaccineName: data.vaccineName,
      doseNumber: Number(data.doseNumber),
      vaccinationDate: data.vaccinationDate,
      hospitalName: data.hospitalName,
      doctorName: data.doctorName,
      batchNumber: data.batchNumber || "N/A",
      nextDueDate: data.nextDueDate || "",
      notes: data.notes || "",
      fileName: fileName
    };

    if (editingRecord) {
      updateRecord(editingRecord.id, recordPayload);
      toast.success("Vaccination record updated!");
    } else {
      addRecord(recordPayload);
      toast.success("Vaccination record submitted for verification!");
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      deleteRecord(id);
      toast.success("Record deleted successfully.");
    }
  };

  const openPreview = (rec) => {
    if (!rec.fileName) return;
    
    // Simulate reading mock files
    const isImage = rec.fileName.endsWith(".png") || rec.fileName.endsWith(".jpg") || rec.fileName.endsWith(".jpeg");
    setActivePreviewType(isImage ? "image" : "pdf");
    setActivePreviewUrl(rec.fileName);
    setPreviewModalOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <CheckCircle className="w-3.5 h-3.5" />
            Verified
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-450 text-xs font-bold">
            <FileX className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      case "correction":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-300 text-xs font-bold animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            Correction Required
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-sky-400 text-xs font-bold">
            <FileClock className="w-3.5 h-3.5 animate-pulse" />
            Pending Verification
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold dark:text-white">Logged Vaccination Records</h2>
          <p className="text-xs text-slate-400">View and manage uploaded vaccine files and medical credentials.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <FilePlus2 className="w-4.5 h-4.5" />
          Log Vaccination
        </button>
      </div>

      {/* Grid of Records */}
      {userRecords.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto flex flex-col items-center">
          <FolderOpen className="w-16 h-16 text-slate-300 mb-4" />
          <h3 className="font-bold text-base dark:text-white mb-1">No Vaccine Logs</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            You haven't uploaded any vaccination history records. Add a log to start tracking timelines and certificates.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-md"
          >
            Log First Vaccine
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userRecords.map((rec) => (
            <div
              key={rec.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate max-w-[150px]" title={rec.vaccineName}>
                      {rec.vaccineName}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400">Dose {rec.doseNumber}</span>
                  </div>
                  {getStatusBadge(rec.verifiedStatus)}
                </div>

                <div className="space-y-2 text-xs mt-4">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>Administered: <span className="font-semibold">{new Date(rec.vaccinationDate).toLocaleDateString()}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Building className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Hospital: <span className="font-semibold">{rec.hospitalName}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <User className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Physician: <span className="font-semibold">{rec.doctorName}</span></span>
                  </div>
                  {rec.batchNumber && (
                    <div className="inline-block px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-400 rounded">
                      Batch: {rec.batchNumber}
                    </div>
                  )}
                </div>

                {/* Rejection/Correction Alert */}
                {(rec.verifiedStatus === "rejected" || rec.verifiedStatus === "correction") && rec.rejectionReason && (
                  <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
                    <span className="font-bold">Feedback:</span> {rec.rejectionReason}
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex gap-1.5">
                  {rec.fileName ? (
                    <button
                      onClick={() => openPreview(rec)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center gap-1 text-[10px] font-bold"
                      title="View Attachment"
                    >
                      <Paperclip className="w-3.5 h-3.5 text-blue-500" />
                      Attachment
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400 italic">No File</span>
                  )}

                  {rec.verifiedStatus === "approved" && (
                    <Link
                      to={`/certificate/${rec.id}`}
                      className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[10px] font-bold transition"
                    >
                      <FileSymlink className="w-3.5 h-3.5" />
                      Certificate
                    </Link>
                  )}
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => handleOpenEditModal(rec)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition"
                    title="Edit Record"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(rec.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition"
                    title="Delete Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CRUD Modal overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              {editingRecord ? "Edit Vaccination Log" : "Log New Vaccination"}
            </h3>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              {/* Vaccine Name */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Vaccine Name *</label>
                <input
                  type="text"
                  {...register("vaccineName", { required: "Vaccine name is required" })}
                  placeholder="e.g. COVID-19 (Pfizer) / Hepatitis B"
                  className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                />
                {errors.vaccineName && <span className="text-[10px] text-rose-500 mt-1 block">{errors.vaccineName.message}</span>}
              </div>

              {/* Dose Number & Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Dose Number *</label>
                  <input
                    type="number"
                    min="1"
                    {...register("doseNumber", { required: "Dose number is required" })}
                    className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                  />
                  {errors.doseNumber && <span className="text-[10px] text-rose-500 mt-1 block">{errors.doseNumber.message}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Vaccination Date *</label>
                  <input
                    type="date"
                    {...register("vaccinationDate", { required: "Date is required" })}
                    className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                  />
                  {errors.vaccinationDate && <span className="text-[10px] text-rose-500 mt-1 block">{errors.vaccinationDate.message}</span>}
                </div>
              </div>

              {/* Hospital & Doctor */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Hospital / Clinic *</label>
                  <input
                    type="text"
                    {...register("hospitalName", { required: "Hospital is required" })}
                    placeholder="e.g. City Clinic"
                    className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                  />
                  {errors.hospitalName && <span className="text-[10px] text-rose-500 mt-1 block">{errors.hospitalName.message}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Doctor Name *</label>
                  <input
                    type="text"
                    {...register("doctorName", { required: "Doctor name is required" })}
                    placeholder="e.g. Dr. Vance"
                    className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                  />
                  {errors.doctorName && <span className="text-[10px] text-rose-500 mt-1 block">{errors.doctorName.message}</span>}
                </div>
              </div>

              {/* Batch & Next Due Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Batch Number</label>
                  <input
                    type="text"
                    {...register("batchNumber")}
                    placeholder="e.g. BT9932"
                    className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Next Due Date</label>
                  <input
                    type="date"
                    {...register("nextDueDate")}
                    className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Physician Notes / Reactions</label>
                <textarea
                  {...register("notes")}
                  rows="2"
                  placeholder="Any soreness, fever or recovery comments..."
                  className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                />
              </div>

              {/* File Attachment */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400 uppercase">Verification File Attachment</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 dark:border-slate-800 border-dashed rounded-xl">
                  <div className="space-y-1 text-center">
                    <Paperclip className="mx-auto h-8 w-8 text-slate-400" />
                    <div className="flex text-xs text-slate-500">
                      <label className="relative cursor-pointer bg-transparent rounded-md font-semibold text-blue-600 dark:text-sky-400 hover:text-blue-500 focus-within:outline-none">
                        <span>Upload record document</span>
                        <input type="file" onChange={handleFileChange} className="hidden" accept=".pdf,.png,.jpg,.jpeg" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-[10px] text-slate-400">PDF, PNG, JPG up to 10MB</p>
                    {selectedFile && (
                      <span className="block text-xs font-semibold text-emerald-500 mt-2 truncate">
                        File selected: {selectedFile.name}
                      </span>
                    )}
                    {!selectedFile && editingRecord?.fileName && (
                      <span className="block text-xs text-slate-400 mt-2 truncate">
                        Current file: {editingRecord.fileName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Simulated Document Preview Modal */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center">
            <h4 className="font-bold text-sm mb-4 dark:text-white truncate max-w-full">
              Document Preview: {activePreviewUrl}
            </h4>

            {activePreviewType === "image" ? (
              <div className="w-full h-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center text-slate-400 overflow-hidden">
                {/* Simulated image slip */}
                <div className="p-4 text-center">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2 animate-bounce" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-350">[Simulated Image Capture of medical certificate slip]</p>
                  <p className="text-[10px] text-slate-400 mt-2">Authentic Clinical Signature & Dose Batch Verification</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center text-slate-400 overflow-hidden">
                {/* Simulated PDF document */}
                <div className="p-4 text-center">
                  <FolderOpen className="w-12 h-12 text-blue-500 mx-auto mb-2 animate-pulse" />
                  <p className="text-xs font-bold text-slate-750 dark:text-slate-350">[Simulated PDF Vaccination Record File]</p>
                  <p className="text-[10px] text-slate-450 mt-1">VaxShield Encrypted Healthcare ID Signature</p>
                </div>
              </div>
            )}

            <button
              onClick={() => setPreviewModalOpen(false)}
              className="mt-6 px-6 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-xs rounded-xl dark:text-white text-slate-700 transition"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
